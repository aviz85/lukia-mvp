import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LukonCard from '../components/LukonCard';
import { Lukon } from '../types/Lukon';
import { fetchLukons, createLukon, getAllTags } from '../services/api';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [lukons, setLukons] = useState<Lukon[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAllTags(tags);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };
    fetchTags();
  }, []);

  const loadLukons = async (keyword: string = '', tags: string[] = []) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedLukons = await fetchLukons(keyword, tags);
      setLukons(fetchedLukons);
    } catch (err) {
      setError('Failed to fetch lukons. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLukons(searchKeyword, selectedTags);
  }, [searchKeyword, selectedTags]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadLukons(searchKeyword, selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleCreateLukon = async () => {
    // ... (קוד קיים)
  };

  return (
    <div className={styles.home}>
      <h1>Welcome to Lukia</h1>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search Lukons"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
      <div className={styles.tagContainer}>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.tagSelected : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <button onClick={handleCreateLukon} className={styles.createButton}>Create New Lukon</button>
      {isLoading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.lukonList}>
        {lukons.map(lukon => (
          <LukonCard key={lukon.id} lukon={lukon} />
        ))}
      </div>
    </div>
  );
};

export default Home;