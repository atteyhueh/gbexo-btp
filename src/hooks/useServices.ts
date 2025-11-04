import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  icon_name: string;
  image_url: string;
  features: string[]; // Array of feature strings
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
      
      // Parse features if they come as JSON strings from the database
      const parsedServices = (data || []).map(service => ({
        ...service,
        features: (() => {
          try {
            // If features is already an array, use it
            if (Array.isArray(service.features)) {
              return service.features;
            }
            // If features is a string, parse it
            if (typeof service.features === 'string') {
              return JSON.parse(service.features);
            }
            // Fallback to empty array
            return [];
          } catch (err) {
            console.error('Error parsing features for service:', service.id, err);
            return [];
          }
        })()
      }));
      
      setServices(parsedServices);
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