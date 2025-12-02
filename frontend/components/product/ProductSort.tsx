'use client';

import styles from './ProductSort.module.css';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductSortProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

/**
 * ProductSort - Selector de ordenamiento de productos
 */
export function ProductSort({ value, onChange }: ProductSortProps) {
    return (
        <div className={styles.sortContainer}>
            <label htmlFor="product-sort" className={styles.label}>
                Ordenar por:
            </label>
            <select
                id="product-sort"
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className={styles.select}
            >
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
                <option value="price-asc">Precio (menor a mayor)</option>
                <option value="price-desc">Precio (mayor a menor)</option>
            </select>
        </div>
    );
}
