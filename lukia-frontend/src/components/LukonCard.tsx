import React from 'react';
import { Link } from 'react-router-dom';
import { Lukon } from '../types/Lukon';
import styles from './LukonCard.module.css';

interface Props {
  lukon: Lukon;
}

const LukonCard: React.FC<Props> = ({ lukon }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{lukon.name}</h2>
      <p className={styles.description}>{lukon.description}</p>
      {lukon.tags && lukon.tags.length > 0 && (
        <div className={styles.tags}>
          {lukon.tags.map((tag: string, index: number) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
      <Link to={`/lukon/${lukon.id}`} className={styles.link}>View Details</Link>
    </div>
  );
};

export default LukonCard;