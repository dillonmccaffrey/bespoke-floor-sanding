const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CMS_PASSWORD = process.env.CMS_PASSWORD || 'xr6$wIXzFL6ZQN@';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Store authenticated sessions
const sessions = new Map();

// Clean expired sessions every hour
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of sessions) {
    if (now - data.created > 24 * 60 * 60 * 1000) {
      sessions.delete(token);
    }
  }
}, 60 * 60 * 1000);

// Password login - returns a GitHub token for CMS to use
app.post('/auth', (req, res) => {
  const { password } = req.body;
  
  console.log('Login attempt received');
  
  if (password === CMS_PASSWORD) {
    // Return the GitHub token directly to the CMS
    // Decap CMS expects: { token, provider }
    console.log('Password correct, returning token');
    
    const responseHtml = `
<!DOCTYPE html>
<html>
<head><title>Authenticating...</title></head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    console.log("receiveMessage", e);
    window.opener.postMessage(
      'authorization:github:success:{"token":"${GITHUB_TOKEN}","provider":"github"}',
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>
    `;
    
    res.send(responseHtml);
  } else {
    console.log('Password incorrect');
    res.status(401).send(`
<!DOCTYPE html>
<html>
<head>
  <title>Login Failed</title>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1A1A1A; color: #F5F5F5; }
    .box { background: #2A2A2A; padding: 2rem; border-radius: 8px; text-align: center; }
    a { color: #C4A052; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Incorrect Password</h2>
    <p><a href="/admin/">Try again</a></p>
  </div>
</body>
</html>
    `);
  }
});

// Login form page
app.get('/auth', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CMS Login | Bespoke Floor Sanding</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1A1A1A;
    }
    .login-box {
      background: #2A2A2A;
      padding: 2rem;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      margin: 1rem;
      border: 1px solid #3A3A3A;
    }
    h1 {
      color: #C4A052;
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      text-align: center;
    }
    p {
      color: #B0B0B0;
      margin: 0 0 1.5rem 0;
      text-align: center;
      font-size: 0.9rem;
    }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #3A3A3A;
      border-radius: 8px;
      background: #1A1A1A;
      color: #F5F5F5;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    input:focus {
      outline: none;
      border-color: #C4A052;
    }
    button {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      background: #C4A052;
      color: #1A1A1A;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover {
      background: #D4B872;
    }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>Bespoke Floor Sanding</h1>
    <p>Enter password to access the content manager</p>
    <form method="POST" action="/auth">
      <input type="password" name="password" placeholder="Password" autofocus required>
      <button type="submit">Login</button>
    </form>
  </div>
</body>
</html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`CMS Auth Proxy running on port ${PORT}`);
  console.log(`GitHub token configured: ${GITHUB_TOKEN ? 'Yes' : 'No'}`);
});
