import { gql } from '@apollo/client';

// Fragment for product details
export const PRODUCT_FRAGMENT = gql`
    fragment ProductDetails on Product {
        id
        name
        slug
        description
        featuredAsset {
            id
            preview
            source
        }
        variants {
            id
            name
            sku
            price
            priceWithTax
            stockLevel
        }
        facetValues {
            id
            name
            facet {
                id
                name
            }
        }
    }
`;

// Get products with pagination
export const GET_PRODUCTS = gql`
    query GetProducts($options: ProductListOptions) {
        products(options: $options) {
            items {
                ...ProductDetails
            }
            totalItems
        }
    }
    ${PRODUCT_FRAGMENT}
`;

// Get single product by slug
export const GET_PRODUCT_BY_SLUG = gql`
    query GetProductBySlug($slug: String!) {
        product(slug: $slug) {
            ...ProductDetails
        }
    }
    ${PRODUCT_FRAGMENT}
`;

// Get collections
export const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                description
                featuredAsset {
                    id
                    preview
                }
                parent {
                    id
                    name
                }
                children {
                    id
                    name
                    slug
                }
            }
            totalItems
        }
    }
`;

// Get products by collection
export const GET_PRODUCTS_BY_COLLECTION = gql`
    query GetProductsByCollection($slug: String!, $options: ProductListOptions) {
        collection(slug: $slug) {
            id
            name
            slug
            description
            productVariants(options: $options) {
                items {
                    id
                    name
                    price
                    priceWithTax
                    product {
                        id
                        name
                        slug
                        featuredAsset {
                            preview
                        }
                    }
                }
                totalItems
            }
        }
    }
`;

// Search products
export const SEARCH_PRODUCTS = gql`
    query SearchProducts($input: SearchInput!) {
        search(input: $input) {
            items {
                productId
                productName
                slug
                description
                priceWithTax {
                    ... on PriceRange {
                        min
                        max
                    }
                    ... on SinglePrice {
                        value
                    }
                }
                productAsset {
                    id
                    preview
                }
                productVariantId
                productVariantName
                sku
                facetValueIds
            }
            totalItems
            facetValues {
                count
                facetValue {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
        }
    }
`;

// Get facets for filtering
export const GET_FACETS = gql`
    query GetFacets {
        facets {
            items {
                id
                name
                code
                values {
                    id
                    name
                    code
                }
            }
        }
    }
`;