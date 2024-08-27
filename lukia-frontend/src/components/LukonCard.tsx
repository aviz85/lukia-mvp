import React from 'react';
import { Link } from 'react-router-dom';
import { Lukon } from '../types/Lukon';
import styles from './LukonCard.module.css';

interface Props {
  lukon: Lukon;
}

const LukonCard: React.FC<{ lukon: Lukon }> = ({ lukon }) => {
  return (
    <div className={styles.card}>
      <h3>{lukon.name}</h3>
      <p>{lukon.description}</p>
      {lukon.tags && lukon.tags.length > 0 && (
        <div className={styles.tags}>
          {lukon.tags.map((tag: string, index: number) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default LukonCard;