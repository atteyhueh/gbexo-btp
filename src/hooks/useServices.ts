import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await api.services.list();
      setServices(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { services, isLoading, error };
}
