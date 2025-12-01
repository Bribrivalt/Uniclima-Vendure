import styles from './page.module.css'

export default function Home() {
    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>Expertos en Climatización</h1>
                    <p className={styles.subtitle}>
                        Instalación, mantenimiento y reparación de sistemas HVAC
                    </p>
                    <div className={styles.heroButtons}>
                        <a href="/productos" className="btn btn-primary">
                            Ver Productos
                        </a>
                        <a href="/servicios" className="btn btn-secondary">
                            Nuestros Servicios
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className="container">
                    <h2>¿Por qué elegirnos?</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.feature}>
                            <h3>🎯 Experiencia</h3>
                            <p>Más de 10 años en el sector de climatización</p>
                        </div>
                        <div className={styles.feature}>
                            <h3>⚡ Rapidez</h3>
                            <p>Instalación y reparación en 24-48h</p>
                        </div>
                        <div className={styles.feature}>
                            <h3>✅ Garantía</h3>
                            <p>Todos nuestros productos con garantía oficial</p>
                        </div>
                        <div className={styles.feature}>
                            <h3>💰 Mejor Precio</h3>
                            <p>Presupuestos sin compromiso</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className="container">
                    <h2>¿Necesitas asesoramiento?</h2>
                    <p>Contacta con nosotros y te ayudaremos a encontrar la mejor solución</p>
                    <a href="/servicios" className="btn btn-primary">
                        Solicitar Presupuesto
                    </a>
                </div>
            </section>
        </div>
    )
}
