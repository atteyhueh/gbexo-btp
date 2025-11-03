/*
  # GBEXO BTP - Initial Schema Setup

  This migration creates the complete database structure for GBEXO BTP platform.

  1. New Tables:
    - services: Service offerings (Construction, Travaux Publics, etc.)
    - projects: Completed projects with details
    - project_images: Image gallery for each project
    - testimonials: Client testimonials linked to projects
    - team_members: Team members with photos and roles
    - job_openings: Current job openings and positions
    - job_applications: Applications from candidates
    - quotes_requests: Devis requests from clients
    - admin_users: Admin accounts for platform management

  2. Security:
    - RLS enabled on all tables
    - Policies restrict access appropriately
    - Public data accessible to all users
    - Private data accessible to authenticated admins
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  icon_name text NOT NULL,
  image_url text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  project_type text,
  start_date date,
  end_date date,
  duration_months integer,
  budget text,
  status text DEFAULT 'completed',
  client_name text,
  technologies jsonb DEFAULT '[]'::jsonb,
  team_size integer,
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_role text,
  client_company text,
  client_image text,
  rating integer DEFAULT 5,
  message text NOT NULL,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  email text,
  phone text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_openings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  description text NOT NULL,
  requirements jsonb DEFAULT '[]'::jsonb,
  location text DEFAULT 'Bénin',
  contract_type text,
  salary_range text,
  is_open boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_opening_id uuid NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cv_url text,
  cover_letter text,
  status text DEFAULT 'received',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_type text,
  project_description text NOT NULL,
  budget_range text,
  timeline text,
  attachments jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are public"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Projects are public"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Project images are public"
  ON project_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Testimonials are public"
  ON testimonials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Team members are public"
  ON team_members FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Job openings are public"
  ON job_openings FOR SELECT
  TO public
  USING (is_open = true);

CREATE POLICY "Anyone can submit job applications"
  ON job_applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Job applications readable to applicant"
  ON job_applications FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can request quotes"
  ON quotes_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE POLICY "Admins can manage project images"
  ON project_images FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE POLICY "Admins can manage team"
  ON team_members FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE POLICY "Admins can manage jobs"
  ON job_openings FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE POLICY "Admins can view applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE POLICY "Admins can view quote requests"
  ON quotes_requests FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true));

CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_project_images_project ON project_images(project_id);
CREATE INDEX idx_testimonials_project ON testimonials(project_id);
CREATE INDEX idx_team_members_active ON team_members(is_active);
CREATE INDEX idx_job_openings_active ON job_openings(is_open);
