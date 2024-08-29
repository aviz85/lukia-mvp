import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lukon } from '../types/Lukon';
import styles from './CreateLukon.module.css';
import { createLukon } from '../services/api';

const CreateLukon: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLukon: Omit<Lukon, 'id' | 'is_deleted' | 'deleted_at'> = {
      name,
      description,
      problem,
      solution,
      user_id: 'temp-user-id', // Replace this with actual user ID when authentication is implemented
      tags,
      createdAt: new Date()
    };

    try {
      const response = await createLukon(newLukon);
      console.log('Lukon created:', response);
      // Redirect to the new Lukon's page or show a success message
    } catch (error) {
      console.error('Error creating Lukon:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Lukon</h1>
      <div className={styles.progressBar}>
        <div className={styles.progressStep} style={{ width: `${step * 25}%` }}></div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {step === 1 && (
          <div className={styles.step}>
            <h2>Step 1: Name and Description</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={styles.textarea}
            />
            <button type="button" onClick={handleNext} className={styles.button}>Next</button>
          </div>
        )}
        {step === 2 && (
          <div className={styles.step}>
            <h2>Step 2: Problem</h2>
            <textarea
              placeholder="Describe the problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
              className={styles.textarea}
            />
            <div className={styles.buttonGroup}>
              <button type="button" onClick={handlePrev} className={styles.button}>Previous</button>
              <button type="button" onClick={handleNext} className={styles.button}>Next</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className={styles.step}>
            <h2>Step 3: Solution</h2>
            <textarea
              placeholder="Describe your solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              required
              className={styles.textarea}
            />
            <div className={styles.buttonGroup}>
              <button type="button" onClick={handlePrev} className={styles.button}>Previous</button>
              <button type="button" onClick={handleNext} className={styles.button}>Next</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className={styles.step}>
            <h2>Step 4: Tags</h2>
            <div className={styles.tagInput}>
              <input
                type="text"
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className={styles.input}
              />
              <button type="button" onClick={handleAddTag} className={styles.button}>Add Tag</button>
            </div>
            <div className={styles.tagList}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className={styles.removeTag}>×</button>
                </span>
              ))}
            </div>
            <div className={styles.buttonGroup}>
              <button type="button" onClick={handlePrev} className={styles.button}>Previous</button>
              <button type="submit" className={styles.button}>Create Lukon</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateLukon;