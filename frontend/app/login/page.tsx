'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { LOGIN_MUTATION } from '@/lib/graphql';
import styles from './page.module.css';

interface LoginResult {
    login: {
        __typename: string;
        id?: string;
        identifier?: string;
        errorCode?: string;
        message?: string;
    };
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [login, { loading }] = useMutation<LoginResult>(LOGIN_MUTATION, {
        onCompleted: (data) => {
            if (data.login.__typename === 'CurrentUser') {
                // Login successful
                router.push('/');
            } else {
                // Login failed
                setError(data.login.message || 'Error al iniciar sesión');
            }
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!email || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        await login({
            variables: {
                username: email,
                password: password,
            },
        });
    };

    return (
        <div className={styles.loginPage}>
            <div className="container">
                <div className={styles.loginCard}>
                    <h1>Iniciar Sesión</h1>
                    <p className={styles.subtitle}>
                        Accede a tu cuenta para gestionar tus pedidos
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tu contraseña"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className={styles.links}>
                        <a href="/registro" className={styles.link}>
                            ¿No tienes cuenta? Regístrate
                        </a>
                        <a href="/recuperar-password" className={styles.link}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}