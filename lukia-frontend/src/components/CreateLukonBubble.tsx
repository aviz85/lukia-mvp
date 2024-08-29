import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { Lukon } from '../types/Lukon';
import { createLukon } from '../services/api';
import styles from './CreateLukonBubble.module.css';

interface Props {
    onClose: () => void;
    onLukonCreated: (lukon: Lukon) => void;
}

const CreateLukonBubble: React.FC<Props> = ({ onClose, onLukonCreated }) => {
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    const questions = [
        "איך נקרא הלוקון החדש שלך?",
        "תאר בקצרה את הלוקון",
        "מהי הבעיה שהלוקון מנסה לפתור?",
        "מהו הפתרון המוצע?",
        "הוסף תגיות שקשורות ללוקון"
    ];

    useEffect(() => {
        anime({
            targets: '.create-lukon-bubble',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .8)'
        });
    }, []);

    useEffect(() => {
        anime({
            targets: '.bubble-background',
            backgroundColor: [
                'rgba(108, 99, 255, 0.3)',
                'rgba(255, 107, 107, 0.3)',
                'rgba(107, 255, 133, 0.3)',
                'rgba(255, 241, 107, 0.3)',
                'rgba(107, 206, 255, 0.3)',
                'rgba(108, 99, 255, 0.3)'  // Adding the first color again for a smooth loop
            ],
            duration: 30000,  // Increased duration for slower transitions
            easing: 'linear',
            loop: true
        });
    }, []);

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (name && description && problem && solution) {
            const newLukon: Omit<Lukon, 'id' | 'is_deleted' | 'deleted_at'> = {
                name,
                description,
                problem,
                solution,
                user_id: 'temp-user-id', // Replace with actual user ID when authentication is implemented
                tags,
                createdAt: new Date()
            };

            try {
                const response = await createLukon(newLukon);
                onLukonCreated({ ...newLukon, id: response.id });
                onClose();
            } catch (error) {
                console.error('Error creating Lukon:', error);
                // Handle error (e.g., show error message to user)
            }
        }
    };

    const handleInputChange = (value: string) => {
        switch (step) {
            case 0: setName(value); break;
            case 1: setDescription(value); break;
            case 2: setProblem(value); break;
            case 3: setSolution(value); break;
            case 4: setCurrentTag(value.replace(/\s+/g, '')); break;  // Remove spaces from tags
        }
    };

    const handleAddTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.bubble} create-lukon-bubble`} onClick={e => e.stopPropagation()}>
                <div className={`${styles.bubbleBackground} bubble-background`}></div>
                <div className={styles.content}>
                    <h2>{questions[step]}</h2>
                    {step < 4 ? (
                        <input 
                            type="text" 
                            value={[name, description, problem, solution][step]}
                            onChange={e => handleInputChange(e.target.value)}
                            placeholder="הקלד כאן..."
                        />
                    ) : (
                        <div className={styles.tagInput}>
                            <input 
                                type="text" 
                                value={currentTag}
                                onChange={e => handleInputChange(e.target.value)}
                                placeholder="הקלד תגית..."
                                onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                            />
                            <button onClick={handleAddTag}>הוסף תגית</button>
                        </div>
                    )}
                    {step === 4 && (
                        <div className={styles.tagContainer}>
                            {tags.map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                    {tag}
                                    <button onClick={() => handleRemoveTag(tag)}>&times;</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <button onClick={handleNext} className={styles.nextButton}>
                        {step < questions.length - 1 ? 'הבא' : 'סיים'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateLukonBubble;