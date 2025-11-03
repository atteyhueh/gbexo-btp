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
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/contact', contactRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
