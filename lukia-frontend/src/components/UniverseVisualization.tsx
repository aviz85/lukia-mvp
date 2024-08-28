import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { Lukon } from '../types/Lukon';
import { fetchLukons, createLukon } from '../services/api';
import CreateLukonBubble from './CreateLukonBubble'; // נייבא את הקומפוננטה החדשה

const UniverseVisualization: React.FC = () => {
    const [lukons, setLukons] = useState<Lukon[]>([]);
    const [filteredLukons, setFilteredLukons] = useState<Lukon[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const universeRef = useRef<HTMLDivElement>(null);
    const searchBoxRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [selectedLukon, setSelectedLukon] = useState<Lukon | null>(null);
    const [isCreatingLukon, setIsCreatingLukon] = useState(false);

    useEffect(() => {
        fetchLukons().then(setLukons);
    }, []);

    useEffect(() => {
        if (searchTerm) {
            fetchLukons(searchTerm).then(setFilteredLukons);
        } else {
            setFilteredLukons(lukons);
        }
    }, [lukons, searchTerm]);

    useEffect(() => {
        updateLukonElements();
    }, [filteredLukons]);

    const updateLukonElements = () => {
        if (!universeRef.current) return;

        // Remove all existing Lukon elements
        universeRef.current.innerHTML = '';

        // Create new elements for filtered Lukons
        filteredLukons.forEach(createLukonElement);
    };

    const createLukonElement = (lukon: Lukon) => {
        if (!universeRef.current) return;

        const lukonEl = document.createElement('div');
        lukonEl.classList.add('lukon');
        lukonEl.setAttribute('data-id', lukon.id);
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
        setIsCreatingLukon(true);
    };

    const handleLukonCreated = (newLukon: Lukon) => {
        setLukons([...lukons, newLukon]);
        setIsCreatingLukon(false);
        // Optionally, you might want to select the newly created Lukon
        setSelectedLukon(newLukon);
    };

    const handleUniverseClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === universeRef.current) {
            setIsSearchOpen(true);
            anime({
                targets: searchBoxRef.current,
                scale: [0, 1],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutElastic(1, .8)',
                complete: () => {
                    searchInputRef.current?.focus();
                }
            });
        }
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
    };

    const closeSearch = () => {
        anime({
            targets: searchBoxRef.current,
            scale: 0,
            opacity: 0,
            duration: 300,
            easing: 'easeInOutQuad',
            complete: () => {
                setIsSearchOpen(false);
            }
        });
    };

    return (
        <div className="universe-container" style={{ direction: 'rtl' }} onClick={handleUniverseClick}>
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
                    <p>תגיות: {selectedLukon.tags.join(', ')}</p>
                </div>
            )}
            {isSearchOpen && (
                <div className="search-overlay" onClick={closeSearch}>
                    <div className="search-box" ref={searchBoxRef} onClick={(e) => e.stopPropagation()}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="חפש לוקונים..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            )}
            {isCreatingLukon && (
                <CreateLukonBubble onClose={() => setIsCreatingLukon(false)} onLukonCreated={handleLukonCreated} />
            )}
        </div>
    );
};

export default UniverseVisualization;