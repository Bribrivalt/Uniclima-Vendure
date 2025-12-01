import styles from './page.module.css';

export default function ConocenosPage() {
    return (
        <div className={styles.conocenosPage}>
            <div className="container">
                {/* Hero Section */}
                <section className={styles.hero}>
                    <h1>Conócenos</h1>
                    <p className={styles.subtitle}>
                        Más de una década dedicados a la climatización profesional
                    </p>
                </section>

                {/* About Section */}
                <section className={styles.aboutSection}>
                    <div className={styles.aboutContent}>
                        <div className={styles.aboutText}>
                            <h2>Nuestra Historia</h2>
                            <p>
                                Uniclima nació con la misión de ofrecer soluciones integrales en 
                                climatización y calefacción. Desde nuestros inicios, nos hemos 
                                comprometido con la excelencia en el servicio y la satisfacción 
                                total de nuestros clientes.
                            </p>
                            <p>
                                Contamos con un equipo de profesionales altamente cualificados, 
                                certificados y en constante formación para estar a la vanguardia 
                                de las últimas tecnologías en el sector HVAC.
                            </p>
                            <p>
                                Trabajamos con las mejores marcas del mercado y disponemos de un 
                                amplio stock de repuestos y accesorios para garantizar una respuesta 
                                rápida ante cualquier necesidad.
                            </p>
                        </div>
                        <div className={styles.aboutImage}>
                            <div className={styles.imagePlaceholder}>
                                <span>🏢</span>
                                <p>Uniclima</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className={styles.valuesSection}>
                    <h2>Nuestros Valores</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>🎯</span>
                            <h3>Profesionalidad</h3>
                            <p>
                                Trabajo riguroso y metódico en cada instalación y reparación, 
                                siguiendo los más altos estándares de calidad.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>💡</span>
                            <h3>Innovación</h3>
                            <p>
                                Incorporamos las últimas tecnologías y soluciones eficientes 
                                para optimizar el confort y el ahorro energético.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>🤝</span>
                            <h3>Confianza</h3>
                            <p>
                                Transparencia en presupuestos y honestidad en nuestros 
                                diagnósticos y recomendaciones.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>⚡</span>
                            <h3>Rapidez</h3>
                            <p>
                                Servicio de urgencias 24h y respuesta ágil para minimizar 
                                cualquier inconveniente.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className={styles.teamSection}>
                    <h2>Nuestro Equipo</h2>
                    <p className={styles.teamIntro}>
                        Un equipo de profesionales comprometidos con tu confort
                    </p>
                    <div className={styles.teamGrid}>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>👨‍💼</div>
                            <h3>Director General</h3>
                            <p>Gestión y estrategia empresarial</p>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>👨‍🔧</div>
                            <h3>Jefe Técnico</h3>
                            <p>Supervisión de instalaciones</p>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>👩‍💻</div>
                            <h3>Atención al Cliente</h3>
                            <p>Soporte y asesoramiento</p>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>👷</div>
                            <h3>Técnicos</h3>
                            <p>Instalación y mantenimiento</p>
                        </div>
                    </div>
                </section>

                {/* Certifications */}
                <section className={styles.certificationsSection}>
                    <h2>Certificaciones y Garantías</h2>
                    <div className={styles.certGrid}>
                        <div className={styles.certItem}>
                            <span>📜</span>
                            <p>Instaladores autorizados</p>
                        </div>
                        <div className={styles.certItem}>
                            <span>🔒</span>
                            <p>Seguro de responsabilidad civil</p>
                        </div>
                        <div className={styles.certItem}>
                            <span>♻️</span>
                            <p>Gestión de gases fluorados</p>
                        </div>
                        <div className={styles.certItem}>
                            <span>✅</span>
                            <p>Garantía en todos los trabajos</p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className={styles.contactSection}>
                    <h2>¿Tienes alguna pregunta?</h2>
                    <p>Estamos aquí para ayudarte</p>
                    <div className={styles.contactButtons}>
                        <a href="/servicios" className="btn btn-primary">
                            Ver Servicios
                        </a>
                        <a href="/productos" className="btn btn-secondary">
                            Ver Productos
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}