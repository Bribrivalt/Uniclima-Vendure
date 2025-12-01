'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_PRODUCTS, GET_COLLECTIONS, GET_FACETS } from '@/lib/graphql';
import styles from './page.module.css';

interface ProductAsset {
    id: string;
    preview: string;
}

interface PriceRange {
    min: number;
    max: number;
}

interface SinglePrice {
    value: number;
}

interface SearchResultItem {
    productId: string;
    productName: string;
    slug: string;
    description: string;
    priceWithTax: PriceRange | SinglePrice;
    productAsset: ProductAsset | null;
    productVariantId: string;
    productVariantName: string;
    sku: string;
}

interface SearchResult {
    search: {
        items: SearchResultItem[];
        totalItems: number;
        facetValues: Array<{
            count: number;
            facetValue: {
                id: string;
                name: string;
                facet: {
                    id: string;
                    name: string;
                };
            };
        }>;
    };
}

interface Collection {
    id: string;
    name: string;
    slug: string;
}

interface CollectionsResult {
    collections: {
        items: Collection[];
        totalItems: number;
    };
}

export default function ProductosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [selectedFacets, setSelectedFacets] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24;

    // Fetch products using search
    const { data, loading, error } = useQuery<SearchResult>(SEARCH_PRODUCTS, {
        variables: {
            input: {
                term: searchTerm,
                collectionSlug: selectedCollection,
                facetValueIds: selectedFacets.length > 0 ? selectedFacets : undefined,
                take: itemsPerPage,
                skip: (currentPage - 1) * itemsPerPage,
                groupByProduct: true,
            },
        },
    });

    // Fetch collections for filter
    const { data: collectionsData } = useQuery<CollectionsResult>(GET_COLLECTIONS, {
        variables: {
            options: {
                topLevelOnly: true,
            },
        },
    });

    const formatPrice = (priceWithTax: PriceRange | SinglePrice): string => {
        if ('value' in priceWithTax) {
            return `${(priceWithTax.value / 100).toFixed(2)} €`;
        }
        if (priceWithTax.min === priceWithTax.max) {
            return `${(priceWithTax.min / 100).toFixed(2)} €`;
        }
        return `${(priceWithTax.min / 100).toFixed(2)} - ${(priceWithTax.max / 100).toFixed(2)} €`;
    };

    const totalPages = data ? Math.ceil(data.search.totalItems / itemsPerPage) : 0;

    return (
        <div className={styles.productosPage}>
            <div className="container">
                <h1>Productos</h1>
                <p className={styles.subtitle}>
                    Encuentra repuestos y accesorios para calderas, aire acondicionado y climatización
                </p>

                {/* Search and Filters */}
                <div className={styles.filtersBar}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.categoryFilter}>
                        <select
                            value={selectedCollection || ''}
                            onChange={(e) => {
                                setSelectedCollection(e.target.value || null);
                                setCurrentPage(1);
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="">Todas las categorías</option>
                            {collectionsData?.collections.items.map((collection) => (
                                <option key={collection.id} value={collection.slug}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                {data && (
                    <p className={styles.resultsCount}>
                        {data.search.totalItems} productos encontrados
                    </p>
                )}

                {/* Loading state */}
                {loading && (
                    <div className={styles.loading}>
                        <p>Cargando productos...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className={styles.error}>
                        <p>Error al cargar productos: {error.message}</p>
                    </div>
                )}

                {/* Products Grid */}
                {data && (
                    <div className={styles.productsGrid}>
                        {data.search.items.map((product) => (
                            <a
                                key={product.productId}
                                href={`/productos/${product.slug}`}
                                className={styles.productCard}
                            >
                                <div className={styles.productImage}>
                                    {product.productAsset ? (
                                        <img
                                            src={product.productAsset.preview}
                                            alt={product.productName}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>
                                            <span>Sin imagen</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.productInfo}>
                                    <h3 className={styles.productName}>{product.productName}</h3>
                                    {product.sku && (
                                        <p className={styles.productSku}>SKU: {product.sku}</p>
                                    )}
                                    <p className={styles.productPrice}>
                                        {formatPrice(product.priceWithTax)}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {data && data.search.items.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No se encontraron productos</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCollection(null);
                                setSelectedFacets([]);
                            }}
                            className="btn btn-secondary"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={styles.pageButton}
                        >
                            ← Anterior
                        </button>
                        <span className={styles.pageInfo}>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={styles.pageButton}
                        >
                            Siguiente →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}