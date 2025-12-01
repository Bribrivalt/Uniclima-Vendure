import { ApolloClient, InMemoryCache, HttpLink, from, FieldMergeFunction } from '@apollo/client';
import { onError, ErrorResponse } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }: ErrorResponse) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
            )
        );
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// HTTP link to Vendure Shop API
const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3001/shop-api',
    credentials: 'include', // Important for session-based auth
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    products: {
                        // Merge pagination results
                        keyArgs: ['options'],
                        merge(existing: { items: unknown[] } | undefined, incoming: { items: unknown[] }) {
                            if (!existing) return incoming;
                            return {
                                ...incoming,
                                items: [...existing.items, ...incoming.items],
                            };
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
        query: {
            fetchPolicy: 'network-only',
        },
    },
});

// Server-side client (no cache)
export function getServerClient() {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3001/shop-api',
            credentials: 'include',
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                fetchPolicy: 'no-cache',
            },
        },
    });
}