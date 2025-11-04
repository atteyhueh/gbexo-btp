/*
  # Create Urgent Announcements Table

  1. New Tables
    - `urgent_announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `message` (text)
      - `is_urgent` (boolean)
      - `is_active` (boolean)
      - `link_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `urgent_announcements` table
    - Add policy for public read access to active urgent announcements
    - Add policy for authenticated users to manage announcements
*/

CREATE TABLE IF NOT EXISTS urgent_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  is_urgent boolean DEFAULT false,
  is_active boolean DEFAULT true,
  link_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE urgent_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active urgent announcements"
  ON urgent_announcements
  FOR SELECT
  USING (is_active = true AND is_urgent = true);

CREATE POLICY "Authenticated users can insert announcements"
  ON urgent_announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update announcements"
  ON urgent_announcements
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete announcements"
  ON urgent_announcements
  FOR DELETE
  TO authenticated
  USING (true);
