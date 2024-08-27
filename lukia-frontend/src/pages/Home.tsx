import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>ברוכים הבאים ללוקיה</h1>
      <p>זהו מסך הבית המקורי עם כל התפריטים והאפשרויות.</p>
      <nav className={styles.homeNav}>
        <Link to="/create">צור לוקון חדש</Link>
        <Link to="/search">חיפוש לוקונים</Link>
        <Link to="/profile">הפרופיל שלי</Link>
        {/* הוסף קישורים נוספים לפי הצורך */}
      </nav>
    </div>
  );
};

export default Home;