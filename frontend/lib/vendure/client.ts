import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Endpoint de Vendure Shop API
const VENDURE_SHOP_API = process.env.NEXT_PUBLIC_VENDURE_SHOP_API || 'http://localhost:3001/shop-api';

// HttpLink para conectar con Vendure
const httpLink = new HttpLink({
    uri: VENDURE_SHOP_API,
    credentials: 'include', // Importante para cookies de sesión
});

// AuthLink para añadir token de autenticación en headers
const authLink = setContext((_, { headers }) => {
    // Obtener token del localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('vendure-auth-token') : null;

    return {
        headers: {
            ...headers,
            ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
    };
});

// ErrorLink para manejar errores globalmente
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// Configuración del cache
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                // Configuración de cache para queries específicas si es necesario
            },
        },
    },
});

// Cliente Apollo
export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});
