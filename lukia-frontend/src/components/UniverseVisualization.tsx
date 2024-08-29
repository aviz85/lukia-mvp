import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { Lukon } from '../types/Lukon';
import { fetchLukons, createLukon, deleteLukon, restoreLukon } from '../services/api';
import CreateLukonBubble from './CreateLukonBubble';
import { FaTrash, FaUndo, FaArchive } from 'react-icons/fa';
import styles from './UniverseVisualization.module.css';

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
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deletedLukons, setDeletedLukons] = useState<Lukon[]>([]);
    const [showDeletedModal, setShowDeletedModal] = useState(false);

    useEffect(() => {
        fetchLukons().then(setLukons);
        fetchLukons(undefined, undefined, true).then(setDeletedLukons);
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

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedLukon) {
            try {
                await deleteLukon(selectedLukon.id);
                setLukons(lukons.filter(lukon => lukon.id !== selectedLukon.id));
                setSelectedLukon(null);
                setShowDeleteConfirmation(false);
            } catch (error) {
                console.error('Error deleting lukon:', error);
                // Optionally, you can add error handling here, such as displaying an error message to the user
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleRestoreLukon = async (lukonId: string) => {
        try {
            await restoreLukon(lukonId);
            setDeletedLukons(deletedLukons.filter(lukon => lukon.id !== lukonId));
            const restoredLukon = deletedLukons.find(lukon => lukon.id === lukonId);
            if (restoredLukon) {
                setLukons([...lukons, restoredLukon]);
            }
        } catch (error) {
            console.error('Error restoring lukon:', error);
        }
    };

    const DeletedLukonsModal = () => (
        <div className={styles.modalOverlay} onClick={() => setShowDeletedModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>לוקונים מחוקים</h2>
                <div className={styles.lukonList}>
                    {deletedLukons.map(lukon => (
                        <div key={lukon.id} className={styles.deletedLukon}>
                            <h3>{lukon.name}</h3>
                            <p>{lukon.description}</p>
                            <p>נמחק ב: {lukon.deleted_at ? new Date(lukon.deleted_at).toLocaleString('he-IL') : 'לא ידוע'}</p>
                            <button onClick={() => handleRestoreLukon(lukon.id)} className={styles.restoreButton}>
                                <FaUndo /> שחזר
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={() => setShowDeletedModal(false)} className={styles.closeButton}>סגור</button>
            </div>
        </div>
    );

    return (
        <div className={styles.universeContainer} style={{ direction: 'rtl' }} onClick={handleUniverseClick}>
            <Link to="/" className={styles.backToHome}>חזרה למסך הבית</Link>
            <div id="universe" ref={universeRef}></div>
            <button id="createLukon" onClick={handleCreateLukon}>צור לוקון חדש</button>
            <button className={styles.showDeletedButton} onClick={() => setShowDeletedModal(true)}>
                <FaArchive /> הצג לוקונים מחוקים
            </button>
            {selectedLukon && (
                <div className={styles.lukonDetails}>
                    <button onClick={() => setSelectedLukon(null)} className={styles.closeButton}>&times;</button>
                    <h2>{selectedLukon.name}</h2>
                    <p>{selectedLukon.description}</p>
                    <p>בעיה: {selectedLukon.problem}</p>
                    <p>פתרון: {selectedLukon.solution}</p>
                    <p>תגיות: {selectedLukon.tags.join(', ')}</p>
                    <button onClick={handleDeleteClick} className={styles.deleteButton}>
                        <FaTrash /> מחק לוקון
                    </button>
                </div>
            )}
            {showDeleteConfirmation && (
                <div className={styles.modalOverlay}>
                    <div className={styles.deleteConfirmation}>
                        <h3>האם אתה בטוח שברצונך למחוק את הלוקון?</h3>
                        <p>פעולה זו אינה הפיכה.</p>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleConfirmDelete} className={styles.confirmDelete}>
                                <FaTrash /> כן, מחק
                            </button>
                            <button onClick={handleCancelDelete} className={styles.cancelDelete}>
                                ביטול
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isSearchOpen && (
                <div className={styles.searchOverlay} onClick={closeSearch}>
                    <div className={styles.searchBox} ref={searchBoxRef} onClick={(e) => e.stopPropagation()}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="חפש לוקונים..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className={styles.searchInput}
                        />
                        <button className={styles.searchButton} onClick={() => fetchLukons(searchTerm)}>
                            חפש
                        </button>
                    </div>
                </div>
            )}
            {isCreatingLukon && (
                <CreateLukonBubble onClose={() => setIsCreatingLukon(false)} onLukonCreated={handleLukonCreated} />
            )}
            {showDeletedModal && <DeletedLukonsModal />}
        </div>
    );
};

export default UniverseVisualization;