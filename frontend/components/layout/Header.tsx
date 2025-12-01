import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className="container">
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        <span>🌡️</span>
                        <span>Uniclima</span>
                    </Link>

                    <div className={styles.menu}>
                        <Link href="/">Inicio</Link>
                        <Link href="/productos">Productos</Link>
                        <Link href="/servicios">Servicios</Link>
                        <Link href="/conocenos">Conócenos</Link>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/login" className="btn btn-secondary">
                            Iniciar Sesión
                        </Link>
                        <Link href="/registro" className="btn btn-primary">
                            Registro
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}
