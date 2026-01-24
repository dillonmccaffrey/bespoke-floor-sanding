const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const yaml = require('js-yaml');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

const CMS_PASSWORD = process.env.CMS_PASSWORD || 'admin123';
const CONTENT_DIR = process.env.CONTENT_DIR || '/app/src/content';
const MEDIA_DIR = process.env.MEDIA_DIR || '/app/public/images';
const APP_DIR = process.env.APP_DIR || '/app';

// Session store
const sessions = new Map();

// File upload config
const storage = multer.diskStorage({
  destination: MEDIA_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Auth middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && sessions.has(token)) {
    sessions.get(token).lastAccess = Date.now();
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Clean old sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of sessions) {
    if (now - data.lastAccess > 24 * 60 * 60 * 1000) {
      sessions.delete(token);
    }
  }
}, 60 * 60 * 1000);

// ============ AUTH ENDPOINTS ============

app.post('/auth/login', (req, res) => {
  const { password } = req.body;
  
  if (password === CMS_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { created: Date.now(), lastAccess: Date.now() });
    res.json({ token, user: { name: 'Admin' } });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/auth/check', requireAuth, (req, res) => {
  res.json({ authenticated: true });
});

app.post('/auth/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) sessions.delete(token);
  res.json({ success: true });
});

// ============ CONTENT ENDPOINTS ============

// Map collection names to directories/files
function getCollectionPath(collection) {
  if (collection === 'settings') return { dir: 'settings', file: 'general' };
  if (collection === 'contact-settings') return { dir: 'settings', file: 'contact' };
  return { dir: collection, file: null };
}

// List collections
app.get('/collections', requireAuth, async (req, res) => {
  try {
    const collections = ['testimonials', 'gallery', 'services', 'settings', 'contact-settings'];
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List entries in a collection
app.get('/collections/:collection', requireAuth, async (req, res) => {
  try {
    const { collection } = req.params;
    const collectionInfo = getCollectionPath(collection);
    const collectionDir = path.join(CONTENT_DIR, collectionInfo.dir);
    
    // For settings-type collections with a specific file, return just that entry
    if (collectionInfo.file) {
      try {
        const filePath = path.join(collectionDir, `${collectionInfo.file}.json`);
        const content = await fs.readFile(filePath, 'utf-8');
        return res.json([{ slug: collectionInfo.file, file: `${collectionInfo.file}.json`, data: parseContent(content, `${collectionInfo.file}.json`) }]);
      } catch {
        return res.json([{ slug: collectionInfo.file, file: `${collectionInfo.file}.json`, data: {} }]);
      }
    }
    
    let files;
    try {
      files = await fs.readdir(collectionDir);
    } catch {
      files = [];
    }
    
    const entries = await Promise.all(
      files
        .filter(f => f.endsWith('.md') || f.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(collectionDir, file), 'utf-8');
          const slug = file.replace(/\.(md|json)$/, '');
          return { slug, file, data: parseContent(content, file) };
        })
    );
    
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single entry
app.get('/collections/:collection/:slug', requireAuth, async (req, res) => {
  try {
    const { collection, slug } = req.params;
    const collectionInfo = getCollectionPath(collection);
    const actualSlug = collectionInfo.file || slug;
    const { content, ext } = await readEntry(collectionInfo.dir, actualSlug);
    res.json({ slug: actualSlug, data: parseContent(content, `${actualSlug}${ext}`), raw: content });
  } catch (err) {
    res.status(404).json({ error: 'Entry not found' });
  }
});

// Create/Update entry
app.post('/collections/:collection/:slug', requireAuth, async (req, res) => {
  try {
    const { collection, slug } = req.params;
    const { data } = req.body;
    const collectionInfo = getCollectionPath(collection);
    const actualSlug = collectionInfo.file || slug;
    const collectionDir = path.join(CONTENT_DIR, collectionInfo.dir);
    
    await fs.mkdir(collectionDir, { recursive: true });
    
    const isSettingsType = collection === 'settings' || collection === 'contact-settings';
    const ext = isSettingsType ? '.json' : '.md';
    const filePath = path.join(collectionDir, `${actualSlug}${ext}`);
    
    let content;
    if (ext === '.json') {
      content = JSON.stringify(data, null, 2);
    } else {
      content = formatMarkdown(data);
    }
    
    await fs.writeFile(filePath, content, 'utf-8');
    
    // Trigger rebuild
    triggerRebuild();
    
    res.json({ success: true, slug: actualSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete entry
app.delete('/collections/:collection/:slug', requireAuth, async (req, res) => {
  try {
    const { collection, slug } = req.params;
    const collectionInfo = getCollectionPath(collection);
    const collectionDir = path.join(CONTENT_DIR, collectionInfo.dir);
    
    for (const ext of ['.md', '.json']) {
      try {
        await fs.unlink(path.join(collectionDir, `${slug}${ext}`));
        triggerRebuild();
        return res.json({ success: true });
      } catch {}
    }
    
    res.status(404).json({ error: 'Entry not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ MEDIA ENDPOINTS ============

app.get('/media', requireAuth, async (req, res) => {
  try {
    const files = await fs.readdir(MEDIA_DIR);
    const media = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
      .map(f => ({ name: f, url: `/images/${f}` }));
    res.json(media);
  } catch {
    res.json([]);
  }
});

app.post('/media', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/images/${req.file.filename}`, name: req.file.filename });
});

app.delete('/media/:filename', requireAuth, async (req, res) => {
  try {
    await fs.unlink(path.join(MEDIA_DIR, req.params.filename));
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: 'File not found' });
  }
});

// ============ HELPERS ============

async function readEntry(collection, slug) {
  const collectionDir = path.join(CONTENT_DIR, collection);
  
  for (const ext of ['.md', '.json']) {
    try {
      const filePath = path.join(collectionDir, `${slug}${ext}`);
      const content = await fs.readFile(filePath, 'utf-8');
      return { content, ext };
    } catch {}
  }
  
  throw new Error('Entry not found');
}

function parseContent(content, filename) {
  if (filename.endsWith('.json')) {
    try {
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
  
  // Parse YAML frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (match) {
    try {
      const data = yaml.load(match[1]) || {};
      data.body = match[2];
      return data;
    } catch {
      return { body: content };
    }
  }
  
  return { body: content };
}

function formatMarkdown(data) {
  const { body, ...frontmatter } = data;
  let content = '---\n';
  content += yaml.dump(frontmatter);
  content += '---\n';
  if (body) content += body;
  return content;
}

// Debounced rebuild - calls webhook to trigger site rebuild
const REBUILD_WEBHOOK = process.env.REBUILD_WEBHOOK;
let rebuildTimeout;
let rebuildPending = false;

function triggerRebuild() {
  rebuildPending = true;
  clearTimeout(rebuildTimeout);
  rebuildTimeout = setTimeout(async () => {
    console.log('Triggering site rebuild...');
    rebuildPending = false;
    
    if (REBUILD_WEBHOOK) {
      try {
        await fetch(REBUILD_WEBHOOK, { method: 'POST' });
        console.log('Rebuild triggered via webhook');
      } catch (err) {
        console.error('Webhook failed:', err.message);
      }
    }
  }, 3000);
}

// Endpoint to check if rebuild is pending
app.get('/rebuild-status', (req, res) => {
  res.json({ pending: rebuildPending });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`CMS API running on port ${PORT}`);
  console.log(`Content dir: ${CONTENT_DIR}`);
  console.log(`Media dir: ${MEDIA_DIR}`);
});
