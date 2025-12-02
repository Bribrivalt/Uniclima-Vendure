'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './vendure/client';
import { AuthProvider } from './auth-context';

/**
 * Providers wrapper para la aplicación
 * Combina Apollo Client y Auth Context
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={apolloClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ApolloProvider>
    );
}
