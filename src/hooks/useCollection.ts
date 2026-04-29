import { useState, useEffect } from 'react';
import { subscribeToCollection } from '../services/dataService';

export const useCollection = <T,>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<T>(collectionName, (items) => {
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading };
};
