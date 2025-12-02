'use client';

import { useState, useEffect } from 'react';
import styles from './ProductSearch.module.css';

export interface ProductSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

/**
 * ProductSearch - Componente de búsqueda con debounce
 * 
 * Permite buscar productos en tiempo real con un retraso (debounce)
 * para evitar demasiadas llamadas mientras el usuario escribe
 */
export function ProductSearch({ onSearch, placeholder = 'Buscar productos...' }: ProductSearchProps) {
    const [query, setQuery] = useState('');

    // Debounce: esperar 500ms después de que el usuario deje de escribir
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className={styles.searchWrapper}>
            <div className={styles.searchContainer}>
                <svg
                    className={styles.searchIcon}
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className={styles.searchInput}
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className={styles.clearButton}
                        aria-label="Limpiar búsqueda"
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
