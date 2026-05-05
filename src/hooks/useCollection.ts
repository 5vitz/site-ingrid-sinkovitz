import { useState, useEffect } from 'react';
import { subscribeToCollection } from '../services/dataService';

export const useCollection = <T,>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Timeout de segurança ultra-rápido: se o firebase não responder em 2s, paramos o loading
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const unsubscribe = subscribeToCollection<T>(collectionName, (items) => {
      clearTimeout(safetyTimeout);
      setData(items);
      setLoading(false);
    });
    
    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, [collectionName]);

  return { data, loading };
};
