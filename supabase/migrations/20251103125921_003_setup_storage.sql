/*
  # Configuration du Storage pour les fichiers

  1. Buckets créés
    - `cvs` - Pour les CVs des candidats
    - `documents` - Pour les documents divers (pièces jointes devis, etc.)
    - `project-images` - Pour les images de projets

  2. Politiques de sécurité
    - Les utilisateurs authentifiés peuvent upload
    - Lecture publique pour les images de projets
    - Accès restreint pour les CVs et documents
*/

INSERT INTO storage.buckets (id, name, public) VALUES
  ('cvs', 'cvs', false),
  ('documents', 'documents', false),
  ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload CVs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Authenticated users can view CVs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'cvs');

CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Anyone can view project images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
