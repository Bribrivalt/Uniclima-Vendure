'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, LOGOUT_MUTATION, REGISTER_MUTATION } from './vendure/mutations/auth';
import { GET_ACTIVE_CUSTOMER } from './vendure/queries/auth';

// ========================================
// TIPOS
// ========================================

export interface Customer {
    id: string;
    title?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
}

export interface RegisterInput {
    title?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
    password: string;
}

export interface AuthContextType {
    currentUser: Customer | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
    checkAuth: () => Promise<void>;
}

// ========================================
// CONTEXTO
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// PROVIDER
// ========================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    // Query para obtener usuario activo
    const { data: customerData, refetch: refetchCustomer } = useQuery(GET_ACTIVE_CUSTOMER, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data?.activeCustomer) {
                setCurrentUser(data.activeCustomer);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        },
        onError: () => {
            setCurrentUser(null);
            setLoading(false);
        },
    });

    // Mutations
    const [loginMutation] = useMutation(LOGIN_MUTATION);
    const [logoutMutation] = useMutation(LOGOUT_MUTATION);
    const [registerMutation] = useMutation(REGISTER_MUTATION);

    // ========================================
    // MÉTODOS
    // ========================================

    /**
     * Login de usuario
     */
    const login = useCallback(
        async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
            try {
                const { data } = await loginMutation({
                    variables: { email, password },
                });

                const result = data?.login;

                // Verificar si hay error
                if (result?.errorCode) {
                    return {
                        success: false,
                        error: result.message || 'Credenciales inválidas',
                    };
                }

                // Login exitoso
                if (result?.id) {
                    // Refetch para obtener datos completos del usuario
                    await refetchCustomer();
                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Error desconocido al iniciar sesión',
                };
            } catch (error) {
                console.error('Error en login:', error);
                return {
                    success: false,
                    error: 'Error de conexión. Por favor, intenta de nuevo.',
                };
            }
        },
        [loginMutation, refetchCustomer]
    );

    /**
     * Registro de nuevo usuario
     */
    const register = useCallback(
        async (input: RegisterInput): Promise<{ success: boolean; error?: string }> => {
            try {
                const { data } = await registerMutation({
                    variables: { input },
                });

                const result = data?.registerCustomerAccount;

                // Verificar si hay error
                if (result?.errorCode) {
                    return {
                        success: false,
                        error: result.message || 'Error al registrar usuario',
                    };
                }

                // Registro exitoso
                if (result?.success) {
                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Error desconocido al registrar usuario',
                };
            } catch (error) {
                console.error('Error en registro:', error);
                return {
                    success: false,
                    error: 'Error de conexión. Por favor, intenta de nuevo.',
                };
            }
        },
        [registerMutation]
    );

    /**
     * Logout de usuario
     */
    const logout = useCallback(async () => {
        try {
            await logoutMutation();
            setCurrentUser(null);

            // Limpiar localStorage si hay token guardado
            if (typeof window !== 'undefined') {
                localStorage.removeItem('vendure-auth-token');
            }
        } catch (error) {
            console.error('Error en logout:', error);
        }
    }, [logoutMutation]);

    /**
     * Verificar autenticación actual
     */
    const checkAuth = useCallback(async () => {
        try {
            await refetchCustomer();
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            setCurrentUser(null);
        }
    }, [refetchCustomer]);

    // ========================================
    // VALOR DEL CONTEXTO
    // ========================================

    const value: AuthContextType = {
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        logout,
        register,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ========================================
// HOOK PERSONALIZADO
// ========================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
};
