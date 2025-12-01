'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { REGISTER_MUTATION } from '@/lib/graphql';
import styles from './page.module.css';

interface RegisterResult {
    registerCustomerAccount: {
        __typename: string;
        success?: boolean;
        errorCode?: string;
        message?: string;
    };
}

export default function RegistroPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [register, { loading }] = useMutation<RegisterResult>(REGISTER_MUTATION, {
        onCompleted: (data) => {
            if (data.registerCustomerAccount.__typename === 'Success') {
                setSuccess(true);
            } else {
                setError(data.registerCustomerAccount.message || 'Error al registrar');
            }
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        await register({
            variables: {
                input: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    emailAddress: formData.emailAddress,
                    password: formData.password,
                },
            },
        });
    };

    if (success) {
        return (
            <div className={styles.registroPage}>
                <div className="container">
                    <div className={styles.successCard}>
                        <span className={styles.successIcon}>✅</span>
                        <h1>¡Registro Exitoso!</h1>
                        <p>
                            Tu cuenta ha sido creada correctamente. Por favor, revisa tu correo 
                            electrónico para verificar tu cuenta.
                        </p>
                        <a href="/login" className="btn btn-primary">
                            Iniciar Sesión
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.registroPage}>
            <div className="container">
                <div className={styles.registroCard}>
                    <h1>Crear Cuenta</h1>
                    <p className={styles.subtitle}>
                        Regístrate para acceder a todas las funcionalidades
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">Nombre</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Apellidos</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Tus apellidos"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="emailAddress">Correo electrónico</label>
                            <input
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 8 caracteres"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repite tu contraseña"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </form>

                    <div className={styles.links}>
                        <a href="/login" className={styles.link}>
                            ¿Ya tienes cuenta? Inicia sesión
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}