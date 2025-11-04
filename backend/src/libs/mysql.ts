import mysql from 'mysql2/promise';

// Configuration de la connexion MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});




// Types existants
export type Service = {
  id: string;
  title: string;
  short_description: string;
  description: string;
  icon_name: string;
  image_url: string;
  features: string[];
  order_index: number;
  is_active: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  project_type: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  budget: string;
  status: string;
  client_name: string;
  technologies: string[];
  team_size: number;
  featured: boolean;
  order_index: number;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  caption: string;
  is_featured: boolean;
  order_index: number;
};

export type Testimonial = {
  id: string;
  project_id: string;
  client_name: string;
  client_role: string;
  client_company: string;
  client_image: string;
  rating: number;
  message: string;
  is_featured: boolean;
  order_index: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  order_index: number;
  is_active: boolean;
};

export type JobOpening = {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  location: string;
  contract_type: string;
  salary_range: string;
  is_open: boolean;
};

export type QuoteRequest = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  project_description: string;
  budget_range: string;
  timeline: string;
};

export type JobApplication = {
  id?: string;
  job_opening_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cv_url?: string;
  cover_letter?: string;
};

// Nouveau type pour les annonces
export type Announcement = {
  id: string;
  title: string;
  content: string;
  cover_image_url: string;
  is_urgent: boolean;
  is_active: boolean;
  link_url?: string;
  created_at: string;
  updated_at: string;
};

// Helper pour parser JSON
const parseJsonField = (field: any): any => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  }
  return field;
};

// API Services
export const db = {
  // Services
  async getServices() {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM services WHERE is_active = true ORDER BY order_index'
    );
    return rows.map(row => ({
      ...row,
      features: parseJsonField(row.features)
    }));
  },

  async getServiceById(id: string) {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return {
      ...rows[0],
      features: parseJsonField(rows[0].features)
    };
  },

  // Projects
  async getProjects(category?: string) {
    let query = 'SELECT * FROM projects';
    const params: any[] = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY order_index DESC, created_at DESC';
    
    const [rows] = await pool.query<any[]>(query, params);
    return rows.map(row => ({
      ...row,
      technologies: parseJsonField(row.technologies)
    }));
  },

  async getProjectById(id: string) {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return {
      ...rows[0],
      technologies: parseJsonField(rows[0].technologies)
    };
  },

  async getProjectImages(projectId: string) {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM project_images WHERE project_id = ? ORDER BY order_index',
      [projectId]
    );
    return rows;
  },

  // Testimonials
  async getTestimonials() {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM testimonials ORDER BY order_index DESC, created_at DESC'
    );
    return rows;
  },

  // Team Members
  async getTeamMembers() {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM team_members WHERE is_active = true ORDER BY order_index'
    );
    return rows;
  },

  // Job Openings
  async getJobOpenings() {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM job_openings WHERE is_open = true ORDER BY created_at DESC'
    );
    return rows.map(row => ({
      ...row,
      requirements: parseJsonField(row.requirements)
    }));
  },

  async getJobById(id: string) {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM job_openings WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return {
      ...rows[0],
      requirements: parseJsonField(rows[0].requirements)
    };
  },

  // Quote Requests
  async createQuoteRequest(data: QuoteRequest) {
    const [result] = await pool.query<any>(
      `INSERT INTO quotes_requests 
       (name, email, phone, service_type, project_description, budget_range, timeline) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email,
        data.phone,
        data.service_type,
        data.project_description,
        data.budget_range,
        data.timeline
      ]
    );
    return { id: result.insertId };
  },

  // Job Applications
  async createJobApplication(data: JobApplication) {
    const [result] = await pool.query<any>(
      `INSERT INTO job_applications 
       (job_opening_id, first_name, last_name, email, phone, cv_url, cover_letter) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.job_opening_id,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.cv_url,
        data.cover_letter
      ]
    );
    return { id: result.insertId };
  },

  // Announcements - Nouvelles méthodes
  async getAnnouncements() {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM announcements WHERE is_active = true ORDER BY created_at DESC'
    );
    return rows;
  },

  async getUrgentAnnouncements() {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM announcements WHERE is_urgent = true AND is_active = true ORDER BY created_at DESC'
    );
    return rows;
  },

  async getAnnouncementById(id: string) {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async createAnnouncement(data: Partial<Announcement>) {
    const [result] = await pool.query<any>(
      `INSERT INTO announcements 
       (title, content, cover_image_url, is_urgent, is_active, link_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.content,
        data.cover_image_url,
        data.is_urgent || false,
        data.is_active !== false,
        data.link_url || null
      ]
    );
    return { id: result.insertId };
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>) {
    const [result] = await pool.query<any>(
      `UPDATE announcements 
       SET title = ?, content = ?, cover_image_url = ?, 
           is_urgent = ?, is_active = ?, link_url = ?
       WHERE id = ?`,
      [
        data.title,
        data.content,
        data.cover_image_url,
        data.is_urgent,
        data.is_active,
        data.link_url || null,
        id
      ]
    );
    return { affected: result.affectedRows };
  },

  async deleteAnnouncement(id: string) {
    const [result] = await pool.query<any>(
      'DELETE FROM announcements WHERE id = ?',
      [id]
    );
    return { affected: result.affectedRows };
  },

  async getAnnouncementsCount() {
    const [rows] = await pool.query<any[]>(
      'SELECT COUNT(*) as count FROM announcements WHERE is_active = true'
    );
    return rows[0].count;
  }
};

export default pool;