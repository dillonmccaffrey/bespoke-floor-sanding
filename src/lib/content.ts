import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const CONTENT_DIR = process.env.CONTENT_DIR || path.join(process.cwd(), 'src/content');

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
  order?: number;
}

interface GalleryItem {
  title: string;
  location: string;
  description?: string;
  beforeImage: string;
  afterImage: string;
  category?: string;
  order?: number;
}

interface Service {
  title: string;
  description: string;
  fullDescription?: string;
  icon: string;
  image?: string;
  features?: string[];
  order?: number;
}

function parseMarkdown(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (match) {
    try {
      const data = yaml.load(match[1]) as Record<string, any>;
      data.body = match[2];
      return data;
    } catch {
      return { body: content };
    }
  }
  return { body: content };
}

function readCollection<T>(collection: string): T[] {
  const collectionDir = path.join(CONTENT_DIR, collection);
  
  try {
    if (!fs.existsSync(collectionDir)) {
      return [];
    }
    
    const files = fs.readdirSync(collectionDir);
    const items: T[] = [];
    
    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.json')) continue;
      
      const content = fs.readFileSync(path.join(collectionDir, file), 'utf-8');
      
      if (file.endsWith('.json')) {
        items.push(JSON.parse(content));
      } else {
        items.push(parseMarkdown(content) as T);
      }
    }
    
    return items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return [];
  }
}

export function getTestimonials(): Testimonial[] {
  const items = readCollection<Testimonial>('testimonials');
  
  // Return defaults if no CMS content
  if (items.length === 0) {
    return [
      { name: 'Gary', location: 'Dublin', quote: 'Nygell arrived right on time and worked efficiently to sand and refinish our living room floors. Highly recommend his service!', rating: 5 },
      { name: 'Emma', location: 'Monaghan', quote: 'Nygell did an incredible job restoring our worn-out hardwood floors. He was professional, did an amazing finish, and left no mess behind!', rating: 5 },
      { name: 'Rachel', location: 'Meath', quote: 'Nygell did an outstanding job refinishing our hardwood floors. He was professional, delivered a flawless finish, and left everything spotless!', rating: 5 },
    ];
  }
  
  // Ensure rating is a number
  return items.map(item => ({
    ...item,
    rating: Number(item.rating) || 5
  }));
}

export function getGallery(): GalleryItem[] {
  const items = readCollection<GalleryItem>('gallery');
  
  // Return defaults if no CMS content
  if (items.length === 0) {
    return [
      { title: 'Victorian Hallway Restoration', location: 'Dublin', description: 'Complete restoration of original Victorian pine flooring', beforeImage: '/images/sanded-floor-photo-1-before.webp', afterImage: '/images/sanded-floor-photo-1-after.webp' },
      { title: 'Modern Oak Living Room', location: 'Meath', description: 'Sanding and finishing of solid oak flooring', beforeImage: '/images/sanded-floor-photo-2-before.webp', afterImage: '/images/sanded-floor-photo-2-after.webp' },
    ];
  }
  
  return items;
}

export function getServices(): Service[] {
  const items = readCollection<Service>('services');
  
  // Return defaults if no CMS content
  if (items.length === 0) {
    return [
      { title: 'Floor Sanding', description: 'Professional dust-free floor sanding to restore your wooden floors to their original beauty.', icon: 'sanding', features: ['Dust-free equipment', 'All wood types', 'Fast turnaround'] },
      { title: 'Floor Restoration', description: 'Complete restoration of damaged, worn, or neglected wooden floors.', icon: 'restoration', features: ['Gap filling', 'Board replacement', 'Stain removal'] },
      { title: 'Floor Finishing', description: 'Premium lacquers, oils, and waxes to protect and enhance your floors.', icon: 'finish', features: ['Multiple finish options', 'Long-lasting protection', 'Quick drying'] },
      { title: 'Commercial Flooring', description: 'Large-scale floor sanding and restoration for offices, schools, and public buildings.', icon: 'commercial', features: ['Weekend work available', 'Minimal disruption', 'Insurance included'] },
    ];
  }
  
  return items;
}

// Settings interfaces
interface GeneralSettings {
  businessName: string;
  logo?: string;
  phone: string;
  email: string;
  tagline?: string;
}

interface ContactSettings {
  title?: string;
  description?: string;
  serviceAreas: string[];
}

interface HeroSettings {
  headline?: string;
  subheadline?: string;
  badge?: string;
}

function readSettingsFile<T>(filename: string, defaults: T): T {
  const filePath = path.join(CONTENT_DIR, 'settings', filename);
  
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return { ...defaults, ...JSON.parse(content) };
    }
  } catch (err) {
    console.error(`Error reading settings/${filename}:`, err);
  }
  
  return defaults;
}

export function getGeneralSettings(): GeneralSettings {
  return readSettingsFile<GeneralSettings>('general.json', {
    businessName: 'Bespoke Floor Sanding Co.',
    phone: '+353 87 402 7101',
    email: 'contact@bespokefloorsanding.ie',
    tagline: 'Premium Floor Sanding by Trusted Experts'
  });
}

export function getContactSettings(): ContactSettings {
  return readSettingsFile<ContactSettings>('contact.json', {
    title: 'Get In Touch',
    description: 'Ready to transform your floors? Contact us for a free, no-obligation quote.',
    serviceAreas: ['Dublin City', 'South Dublin', 'North Dublin', 'Monaghan', 'Cavan', 'Meath', 'Louth', 'Midlands', 'North Ireland']
  });
}

export function getHeroSettings(): HeroSettings {
  return readSettingsFile<HeroSettings>('hero.json', {
    headline: 'Premium Floor Sanding By Trusted Experts',
    subheadline: 'With unmatched quality, precision, and care, we restore the beauty of your wooden floors to perfection.',
    badge: 'Trusted Experts Since 2010'
  });
}

// Helper to format phone for tel: links
export function formatPhoneHref(phone: string): string {
  return 'tel:' + phone.replace(/\s+/g, '');
}

// Helper to format email for mailto: links
export function formatEmailHref(email: string): string {
  return 'mailto:' + email;
}
