import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `img_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}${ext}`);
  }
});
const upload = multer({ storage });

// Local In-Memory / File Store for Dev Preview Mode
let activeSession = null;

// Initial Mock Datasets
let dbData = {
  products: [
    {
      id: 'luxury-hotel',
      title: 'Grand Palace Luxury Hotel',
      tagline: 'High-end 5-Star Hotel Booking & Reservation Portal',
      category: 'Hotel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
      description: 'An elegant reservation portal for a luxury resort featuring 360 virtual room tours, real-time booking calendar, PHP reservation engine, and Stripe integration.',
      technologies: ['PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'Three.js'],
      githubUrl: 'https://github.com/djchaudhary/luxury-hotel-resort',
      liveUrl: '#',
      demoType: 'hotel',
      highlights: ['Interactive room booking calendar with PHP availability engine', '3D rotating luxury suite previews powered by Three.js', 'Automated PDF invoice generation and email notifications'],
      display_order: 1
    },
    {
      id: 'mobile-store',
      title: 'NexTech Mobile Store',
      tagline: 'Smart Tech E-Shop & Smartphone Specs Comparison Engine',
      category: 'Mobile Store',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
      description: 'A sleek tech retail web app showcasing flagship smartphones with side-by-side spec comparison, live search filtering, and order tracking.',
      technologies: ['React', 'JavaScript', 'Tailwind CSS', 'PHP', 'MySQL'],
      githubUrl: 'https://github.com/djchaudhary/nextech-mobile-store',
      liveUrl: '#',
      demoType: 'mobile-store',
      highlights: ['Side-by-side smartphone spec comparator (RAM, Camera, Chipset)', 'Instant AJAX live search with autocomplete', 'Shopping cart with local storage persistence'],
      display_order: 2
    },
    {
      id: 'real-estate',
      title: 'Apex Estates & Villas',
      tagline: 'Modern Property Portal with Interactive Map & Filter Search',
      category: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      description: 'A premier real estate directory allowing buyers to search luxury homes, filter by price/bedroom/amenities, view floor plans, and schedule agent calls.',
      technologies: ['PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'GSAP'],
      githubUrl: 'https://github.com/djchaudhary/apex-realestate-portal',
      liveUrl: '#',
      demoType: 'real-estate',
      highlights: ['Multi-parameter filter (Location, Price Range, Property Type)', 'Mortgage calculator with interactive breakdown', 'PHP lead management portal for estate agents'],
      display_order: 3
    }
  ],
  skills: [
    { id: 'html5', name: 'HTML5', level: 98, category: 'frontend', icon: 'code-2', color: '#e34f26', experienceYears: '5+ Yrs', description: 'Semantic markup, accessibility, SEO, DOM optimization.' },
    { id: 'css3', name: 'CSS3', level: 95, category: 'frontend', icon: 'palette', color: '#1572b6', experienceYears: '5+ Yrs', description: 'Flexbox, Grid, keyframes, glassmorphism, responsive breakpoints.' },
    { id: 'js', name: 'JavaScript', level: 94, category: 'frontend', icon: 'file-json', color: '#f7df1e', experienceYears: '5+ Yrs', description: 'ES6+, async programming, DOM manipulation, WebGL.' },
    { id: 'tailwind', name: 'Tailwind CSS', level: 96, category: 'frontend', icon: 'wind', color: '#38bdf8', experienceYears: '4+ Yrs', description: 'Rapid UI development, custom design tokens, dark mode.' },
    { id: 'php', name: 'PHP', level: 92, category: 'backend', icon: 'server', color: '#777bb4', experienceYears: '5+ Yrs', description: 'Object-Oriented PHP, REST APIs, MVC architecture, custom CMS.' },
    { id: 'mysql', name: 'MySQL', level: 88, category: 'database', icon: 'database', color: '#00758f', experienceYears: '4+ Yrs', description: 'Schema design, query optimization, index tuning, foreign keys.' }
  ],
  experience: [
    { id: 'role-1', year: '2024 - PRESENT', role: 'Lead Full-Stack Web Developer', company: 'Nexus Digital Solutions', location: 'Chandigarh, IN', type: 'Full-time', description: 'Spearheading client web projects and building enterprise PHP backends.', highlights: ['Architected 15+ custom web apps', 'Improved page load speeds by 45%'], technologies: ['React', 'PHP', 'MySQL', 'Tailwind CSS'] },
    { id: 'role-2', year: '2022 - 2024', role: 'Senior Front-End & PHP Developer', company: 'Aura Media Works', location: 'Remote', type: 'Full-time', description: 'Developed e-commerce portals and custom booking engines.', highlights: ['Engineered PHP reservation system processing 10,000+ monthly bookings'], technologies: ['PHP', 'JavaScript', 'MySQL', 'Tailwind CSS'] }
  ],
  testimonials: [
    { id: 'test-1', name: 'Robert Sterling', role: 'General Manager', company: 'Grand Palace Resort', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', content: 'DJ Chaudhary transformed our hotel booking website completely! Direct bookings increased by 38%.', rating: 5, projectRef: 'Grand Palace Luxury Hotel' }
  ],
  messages: []
};

// PHP API Emulation Routes for Express Dev Server
app.post('/login.php', (req, res) => {
  const { email, password } = req.body;
  if ((email === 'admin@djchaudhary.dev' || email === 'admin@gmail.com' || email) && password) {
    activeSession = { email: email || 'admin@djchaudhary.dev' };
    return res.json({ success: true, message: 'Login successful!', data: { user: activeSession } });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.all(['/logout.php', '/logout'], (req, res) => {
  activeSession = null;
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.all(['/check-auth.php', '/check-auth'], (req, res) => {
  res.json({
    success: true,
    data: {
      authenticated: !!activeSession,
      user: activeSession
    }
  });
});

app.all(['/get-items.php', '/get-products.php'], (req, res) => {
  const type = req.query.type || 'projects';
  const collectionKey = type === 'contacts' ? 'messages' : (type === 'projects' ? 'products' : type);
  const data = dbData[collectionKey] || [];
  res.json({ success: true, data });
});

app.post('/upload-image.php', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  res.json({ success: true, url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

app.post(['/add-item.php', '/add-product.php'], (req, res) => {
  const type = req.query.type || req.body.type || 'projects';
  const collectionKey = type === 'contacts' ? 'messages' : (type === 'projects' ? 'products' : type);
  const newItem = {
    id: req.body.id || `item_${Date.now()}_${Math.floor(Math.random() * 899 + 100)}`,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  if (!dbData[collectionKey]) dbData[collectionKey] = [];
  dbData[collectionKey].unshift(newItem);
  res.json({ success: true, message: 'Item created successfully', data: newItem });
});

app.all(['/update-item.php', '/update-product.php'], (req, res) => {
  const type = req.query.type || req.body.type || 'projects';
  const collectionKey = type === 'contacts' ? 'messages' : (type === 'projects' ? 'products' : type);
  const { id, ...updates } = req.body;
  const list = dbData[collectionKey] || [];
  const idx = list.findIndex(i => String(i.id) === String(id));
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
  }
  res.json({ success: true, message: 'Item updated successfully' });
});

app.all(['/delete-item.php', '/delete-product.php'], (req, res) => {
  const type = req.query.type || req.body.type || 'projects';
  const id = req.query.id || req.body.id;
  const collectionKey = type === 'contacts' ? 'messages' : (type === 'projects' ? 'products' : type);
  if (dbData[collectionKey]) {
    dbData[collectionKey] = dbData[collectionKey].filter(i => String(i.id) !== String(id));
  }
  res.json({ success: true, message: 'Item deleted successfully' });
});

app.all(['/stats.php', '/stats'], (req, res) => {
  res.json({
    success: true,
    data: {
      totalProjects: dbData.products.length,
      totalMessages: dbData.messages.length,
      unreadMessages: dbData.messages.filter(m => !m.read).length,
      totalSkills: dbData.skills.length,
      totalExperience: dbData.experience.length
    }
  });
});

// Serve static files from root directory
app.use(express.static(__dirname));

// Route fallback for SPA/Static HTML navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DJ Chaudhary Portfolio Server running on http://0.0.0.0:${PORT}`);
});
