import React, { useState, useEffect } from 'react';
import { Lukon } from '../types/Lukon';
import styles from './LukonCanvas.module.css';
import { fetchLukons } from '../services/api';

const LukonCanvas: React.FC = () => {
  const [lukons, setLukons] = useState<Lukon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLukons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedLukons = await fetchLukons();
      setLukons(fetchedLukons);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching lukons:', err);
      setError('Failed to fetch lukons. Please try again later.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLukons();
  }, []);

  if (isLoading) return <div className={styles.message}>Loading...</div>;
  if (error) return (
    <div className={styles.message}>
      Error: {error}
      <button onClick={getLukons} className={styles.retryButton}>Retry</button>
    </div>
  );
  if (lukons.length === 0) return <div className={styles.message}>No Lukons found.</div>;

  return (
    <div className={styles.canvas}>
      {lukons.map(lukon => (
        <div 
          key={lukon.id} 
          className={styles.lukonNode}
          style={{
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
          }}
        >
          <h3>{lukon.name}</h3>
          <p>{lukon.description}</p>
        </div>
      ))}
    </div>
  );
};

export default LukonCanvas;