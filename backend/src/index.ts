import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import servicesRoutes from './routes/services.js';
import jobsRoutes from './routes/jobs.js';
import teamRoutes from './routes/team.js';
import testimonialsRoutes from './routes/testimonials.js';
import quotesRoutes from './routes/quotes.js';
import announcementsRouter from './routes/announcements.js'
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware de débogage pour voir toutes les requêtes
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/contact', contactRoutes);

// IMPORTANT: Montage du router announcements
console.log('🔧 Mounting announcements router at /api');
app.use('/api', announcementsRouter);

// Afficher toutes les routes enregistrées au démarrage
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`Route: ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        console.log(`Route: ${Object.keys(handler.route.methods)} ${handler.route.path}`);
      }
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Available routes:`);
  console.log(`   - GET  /api/announcements/urgent`);
  console.log(`   - GET  /api/announcements/count`);
  console.log(`   - GET  /api/announcements`);
  console.log(`   - GET  /api/announcements/:id/media`);
  console.log(`   - POST /api/announcements/:id/media`);
  console.log(`   - GET  /api/announcements/:id`);
  console.log(`   - POST /api/announcements`);
  console.log(`   - PUT  /api/announcements/:id`);
  console.log(`   - DELETE /api/announcements/:id`);
});