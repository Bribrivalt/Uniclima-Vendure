'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    // Estados del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Validación básica
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Si ya está autenticado, redirigir
    if (isAuthenticated) {
        router.push('/');
        return null;
    }

    // Validar email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('El email es requerido');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Formato de email inválido');
            return false;
        }
        setEmailError('');
        return true;
    };

    // Validar contraseña
    const validatePassword = (password: string): boolean => {
        if (!password) {
            setPasswordError('La contraseña es requerida');
            return false;
        }
        setPasswordError('');
        return true;
    };

    // Manejar submit del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validar campos
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                // Guardar "recuérdame" en localStorage si está marcado
                if (rememberMe) {
                    localStorage.setItem('uniclima-remember', 'true');
                }

                // Redirigir a la página principal o cuenta
                router.push('/');
            } else {
                setError(result.error || 'Error al iniciar sesión');
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
                    <button className={`${styles.tab} ${styles.tabActive}`}>
                        Acceder
                    </button>
                    <Link href="/registro" className={styles.tab}>
                        Registro
                    </Link>
                </div>

                {/* Contenedor del formulario */}
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Iniciar Sesión</h1>
                    <p className={styles.subtitle}>
                        Accede a tu cuenta de Uniclima
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

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Campo Email */}
                        <Input
                            type="email"
                            label="Email o nombre de usuario"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) validateEmail(e.target.value);
                            }}
                            onBlur={() => validateEmail(email)}
                            error={emailError}
                            fullWidth
                            required
                            disabled={isLoading}
                        />

                        {/* Campo Contraseña */}
                        <Input
                            type="password"
                            label="Contraseña"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordError) validatePassword(e.target.value);
                            }}
                            onBlur={() => validatePassword(password)}
                            error={passwordError}
                            fullWidth
                            required
                            disabled={isLoading}
                        />

                        {/* Opciones adicionales */}
                        <div className={styles.formOptions}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className={styles.checkbox}
                                    disabled={isLoading}
                                />
                                <span>Recuérdame</span>
                            </label>

                            <Link href="/recuperar-password" className={styles.forgotLink}>
                                ¿Has olvidado la contraseña?
                            </Link>
                        </div>

                        {/* Botón de submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Acceder
                        </Button>
                    </form>

                    {/* Enlace a registro */}
                    <div className={styles.registerPrompt}>
                        <p>
                            ¿No tienes una cuenta?{' '}
                            <Link href="/registro" className={styles.registerLink}>
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
