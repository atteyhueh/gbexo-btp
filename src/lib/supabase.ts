import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
