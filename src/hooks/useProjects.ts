import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  order_index: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  order_index: number;
  technologies: string[];
  images?: ProjectImage[];
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await api.projects.list();
      setProjects(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { projects, isLoading, error, refetch: fetchProjects };
}

export function useProjectById(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.projects.get(id);
      setProject(data);
      setImages(data.images || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  return { project, images, isLoading, error };
}
