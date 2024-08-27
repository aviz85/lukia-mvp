import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import anime from 'animejs';
import { Lukon } from '../types/Lukon';
import { fetchLukons, createLukon } from '../services/api';

const UniverseVisualization: React.FC = () => {
    const [lukons, setLukons] = useState<Lukon[]>([]);
    const universeRef = useRef<HTMLDivElement>(null);
    const [selectedLukon, setSelectedLukon] = useState<Lukon | null>(null);

    useEffect(() => {
        fetchLukons().then(setLukons);
    }, []);

    useEffect(() => {
        lukons.forEach(createLukonElement);
    }, [lukons]);

    const createLukonElement = (lukon: Lukon) => {
        if (!universeRef.current) return;

        const lukonEl = document.createElement('div');
        lukonEl.classList.add('lukon');
        lukonEl.textContent = lukon.name;
        lukonEl.style.left = `${Math.random() * (window.innerWidth - 150)}px`;
        lukonEl.style.top = `${Math.random() * (window.innerHeight - 150)}px`;
        
        lukonEl.addEventListener('click', () => setSelectedLukon(lukon));
        
        universeRef.current.appendChild(lukonEl);
        
        anime({
            targets: lukonEl,
            translateY: ['20px', '-20px'],
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutQuad',
            duration: 4000 + Math.random() * 2000
        });
    };

    const handleCreateLukon = () => {
        const tagsInput = prompt("תגיות (מופרדות בפסיקים):") || "";
        const newLukon: Omit<Lukon, 'id'> = {
            name: prompt("שם הלוקון:") || "",
            description: prompt("תיאור הלוקון:") || "",
            problem: prompt("תיאור הבעיה:") || "",
            solution: prompt("הצעת פתרון:") || "",
            user_id: "temp_user_id", // Replace with actual user ID when authentication is implemented
            tags: tagsInput.split(',').map(tag => tag.trim()), // Convert string to array
            createdAt: new Date()
        };
        createLukon(newLukon).then(response => {
            setLukons([...lukons, { ...newLukon, id: response.id }]);
        });
    };

    return (
        <div className="universe-container" style={{ direction: 'rtl' }}>
            <Link to="/" className="back-to-home">חזרה למסך הבית</Link>
            <div id="universe" ref={universeRef}></div>
            <button id="createLukon" onClick={handleCreateLukon}>צור לוקון חדש</button>
            {selectedLukon && (
                <div id="lukonDetails">
                    <button onClick={() => setSelectedLukon(null)}>&times;</button>
                    <h2>{selectedLukon.name}</h2>
                    <p>{selectedLukon.description}</p>
                    <p>בעיה: {selectedLukon.problem}</p>
                    <p>פתרון: {selectedLukon.solution}</p>
                </div>
            )}
        </div>
    );
};

export default UniverseVisualization;