'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, RegisterInput } from '@/lib/auth-context';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import styles from './page.module.css';

export default function RegistroPage() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();

    // Estados del formulario
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Errores de validación
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Si ya está autenticado, redirigir
    if (isAuthenticated) {
        router.push('/');
        return null;
    }

    // Actualizar campo del formulario
    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Validar formulario
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validar nombre
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es requerido';
        }

        // Validar apellido
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.emailAddress) {
            newErrors.emailAddress = 'El email es requerido';
        } else if (!emailRegex.test(formData.emailAddress)) {
            newErrors.emailAddress = 'Formato de email inválido';
        }

        // Validar teléfono (opcional pero si se ingresa debe tener formato válido)
        if (formData.phoneNumber && formData.phoneNumber.length < 9) {
            newErrors.phoneNumber = 'El teléfono debe tener al menos 9 dígitos';
        }

        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Preparar datos para el registro
            const registerData: RegisterInput = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                emailAddress: formData.emailAddress.trim(),
                phoneNumber: formData.phoneNumber.trim() || undefined,
                password: formData.password,
            };

            const result = await register(registerData);

            if (result.success) {
                setSuccess(true);
                // Esperar 2 segundos y redirigir a login
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(result.error || 'Error al registrar usuario');
            }
        } catch (err) {
            setError('Error de conexión. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                {/* Tabs de Acceder / Registro */}
                <div className={styles.tabs}>
                    <Link href="/login" className={styles.tab}>
                        Acceder
                    </Link>
                    <button className={`${styles.tab} ${styles.tabActive}`}>
                        Registro
                    </button>
                </div>

                {/* Contenedor del formulario */}
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Crear Cuenta</h1>
                    <p className={styles.subtitle}>
                        Regístrate para acceder a todos nuestros servicios
                    </p>

                    {/* Mensaje de error general */}
                    {error && (
                        <div className={styles.errorAlert}>
                            <svg
                                className={styles.errorIcon}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Mensaje de éxito */}
                    {success && (
                        <div className={styles.successAlert}>
                            <svg
                                className={styles.successIcon}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>¡Registro exitoso! Redirigiendo al login...</span>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Nombre y Apellido en la misma fila */}
                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                label="Nombre"
                                placeholder="Juan"
                                value={formData.firstName}
                                onChange={(e) => updateField('firstName', e.target.value)}
                                error={errors.firstName}
                                required
                                disabled={isLoading || success}
                            />

                            <Input
                                type="text"
                                label="Apellido"
                                placeholder="Pérez"
                                value={formData.lastName}
                                onChange={(e) => updateField('lastName', e.target.value)}
                                error={errors.lastName}
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        {/* Email */}
                        <Input
                            type="email"
                            label="Email"
                            placeholder="tu@email.com"
                            value={formData.emailAddress}
                            onChange={(e) => updateField('emailAddress', e.target.value)}
                            error={errors.emailAddress}
                            fullWidth
                            required
                            disabled={isLoading || success}
                        />

                        {/* Teléfono (opcional) */}
                        <Input
                            type="tel"
                            label="Teléfono (opcional)"
                            placeholder="+34 600 000 000"
                            value={formData.phoneNumber}
                            onChange={(e) => updateField('phoneNumber', e.target.value)}
                            error={errors.phoneNumber}
                            fullWidth
                            disabled={isLoading || success}
                        />

                        {/* Contraseña */}
                        <Input
                            type="password"
                            label="Contraseña"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            error={errors.password}
                            helperText="Mínimo 8 caracteres"
                            fullWidth
                            required
                            disabled={isLoading || success}
                        />

                        {/* Confirmar Contraseña */}
                        <Input
                            type="password"
                            label="Confirmar Contraseña"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                            fullWidth
                            required
                            disabled={isLoading || success}
                        />

                        {/* Botón de submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading || success}
                        >
                            Crear Cuenta
                        </Button>
                    </form>

                    {/* Enlace a login */}
                    <div className={styles.loginPrompt}>
                        <p>
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="/login" className={styles.loginLink}>
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
