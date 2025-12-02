'use client';

import { Button, Input, Card } from '@/components/core';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import styles from './page.module.css';

export default function TestComponentsPage() {
    const { currentUser, isAuthenticated, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputError, setInputError] = useState('');

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>🧪 Página de Prueba - Componentes y Auth</h1>
                <p className={styles.subtitle}>
                    Esta página sirve para verificar que todos los componentes y el sistema de autenticación funcionan correctamente.
                </p>

                {/* Estado de Autenticación */}
                <Card padding="lg">
                    <h2>🔐 Estado de Autenticación</h2>
                    <div className={styles.authStatus}>
                        <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
                        <p><strong>Autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}</p>
                        {currentUser && (
                            <div className={styles.userInfo}>
                                <p><strong>Usuario:</strong> {currentUser.firstName} {currentUser.lastName}</p>
                                <p><strong>Email:</strong> {currentUser.emailAddress}</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Botones */}
                <Card padding="lg">
                    <h2>🔘 Botones</h2>
                    <div className={styles.buttonGrid}>
                        <div>
                            <p className={styles.label}>Primary</p>
                            <Button variant="primary">Botón Primary</Button>
                        </div>
                        <div>
                            <p className={styles.label}>Secondary</p>
                            <Button variant="secondary">Botón Secondary</Button>
                        </div>
                        <div>
                            <p className={styles.label}>Outline</p>
                            <Button variant="outline">Botón Outline</Button>
                        </div>
                        <div>
                            <p className={styles.label}>Loading</p>
                            <Button variant="primary" loading>Cargando</Button>
                        </div>
                        <div>
                            <p className={styles.label}>Disabled</p>
                            <Button variant="primary" disabled>Deshabilitado</Button>
                        </div>
                        <div>
                            <p className={styles.label}>Full Width</p>
                            <Button variant="primary" fullWidth>Ancho Completo</Button>
                        </div>
                    </div>
                </Card>

                {/* Inputs */}
                <Card padding="lg">
                    <h2>📝 Inputs</h2>
                    <div className={styles.inputGrid}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Input con Error"
                            type="text"
                            error="Este campo tiene un error"
                            placeholder="Texto con error"
                        />
                        <Input
                            label="Input Deshabilitado"
                            type="text"
                            disabled
                            placeholder="Campo deshabilitado"
                        />
                        <Input
                            label="Input con Helper Text"
                            type="text"
                            helperText="Este es un texto de ayuda"
                            placeholder="Texto normal"
                        />
                    </div>
                </Card>

                {/* Cards */}
                <Card padding="lg">
                    <h2>🃏 Cards</h2>
                    <div className={styles.cardGrid}>
                        <Card padding="sm">
                            <h3>Card Small</h3>
                            <p>Padding pequeño</p>
                        </Card>
                        <Card padding="md">
                            <h3>Card Medium</h3>
                            <p>Padding mediano (default)</p>
                        </Card>
                        <Card padding="lg">
                            <h3>Card Large</h3>
                            <p>Padding grande</p>
                        </Card>
                        <Card padding="md" hover>
                            <h3>Card con Hover</h3>
                            <p>Pasa el mouse por encima</p>
                        </Card>
                    </div>
                </Card>

                {/* Colores */}
                <Card padding="lg">
                    <h2>🎨 Paleta de Colores</h2>
                    <div className={styles.colorGrid}>
                        <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-primary)' }}>
                            <span>Primary</span>
                        </div>
                        <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-primary-dark)' }}>
                            <span>Primary Dark</span>
                        </div>
                        <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-surface)' }}>
                            <span>Surface</span>
                        </div>
                        <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-background-elevated)' }}>
                            <span>Background Elevated</span>
                        </div>
                    </div>
                </Card>

                {/* Tipografía */}
                <Card padding="lg">
                    <h2>📚 Tipografía</h2>
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <h4>Heading 4</h4>
                    <h5>Heading 5</h5>
                    <h6>Heading 6</h6>
                    <p>Párrafo normal con texto secundario</p>
                    <small>Texto pequeño</small>
                </Card>
            </div>
        </div>
    );
}
