import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <h3>Uniclima</h3>
                        <p>Especialistas en climatización profesional desde 2014</p>
                    </div>

                    <div className={styles.column}>
                        <h4>Enlaces</h4>
                        <ul>
                            <li><a href="/">Inicio</a></li>
                            <li><a href="/productos">Productos</a></li>
                            <li><a href="/servicios">Servicios</a></li>
                            <li><a href="/conocenos">Conócenos</a></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Contacto</h4>
                        <ul>
                            <li>📧 info@uniclima.com</li>
                            <li>📞 +34 XXX XXX XXX</li>
                            <li>📍 Madrid, España</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; 2024 Uniclima. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
