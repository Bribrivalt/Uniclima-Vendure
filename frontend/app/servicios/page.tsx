import styles from './page.module.css';

export default function ServiciosPage() {
    return (
        <div className={styles.serviciosPage}>
            <div className="container">
                {/* Hero Section */}
                <section className={styles.hero}>
                    <h1>Nuestros Servicios</h1>
                    <p className={styles.subtitle}>
                        Soluciones profesionales en climatización y calefacción para hogares y empresas
                    </p>
                </section>

                {/* Services Grid */}
                <section className={styles.servicesSection}>
                    <div className={styles.servicesGrid}>
                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>❄️</div>
                            <h3>Aire Acondicionado</h3>
                            <p>Instalación, mantenimiento y reparación de sistemas de aire acondicionado domésticos e industriales.</p>
                            <ul className={styles.serviceFeatures}>
                                <li>Instalación de splits y multisplits</li>
                                <li>Sistemas de climatización centralizada</li>
                                <li>Mantenimiento preventivo</li>
                                <li>Reparación de averías</li>
                            </ul>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🔥</div>
                            <h3>Calderas</h3>
                            <p>Expertos en calderas de gas, gasóleo y biomasa para calefacción y agua caliente sanitaria.</p>
                            <ul className={styles.serviceFeatures}>
                                <li>Instalación de calderas</li>
                                <li>Revisiones anuales obligatorias</li>
                                <li>Reparación de calderas</li>
                                <li>Sustitución de equipos antiguos</li>
                            </ul>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🌡️</div>
                            <h3>Calefacción</h3>
                            <p>Sistemas de calefacción eficientes para mantener tu hogar confortable durante todo el año.</p>
                            <ul className={styles.serviceFeatures}>
                                <li>Radiadores y suelo radiante</li>
                                <li>Bombas de calor</li>
                                <li>Termostatos inteligentes</li>
                                <li>Optimización energética</li>
                            </ul>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>💨</div>
                            <h3>Ventilación</h3>
                            <p>Sistemas de ventilación para garantizar la calidad del aire interior en cualquier espacio.</p>
                            <ul className={styles.serviceFeatures}>
                                <li>Ventilación mecánica controlada</li>
                                <li>Extractores industriales</li>
                                <li>Recuperadores de calor</li>
                                <li>Purificación del aire</li>
                            </ul>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🔧</div>
                            <h3>Mantenimiento</h3>
                            <p>Contratos de mantenimiento para prolongar la vida útil de tus equipos y prevenir averías.</p>
                            <ul className={styles.serviceFeatures}>
                                <li>Revisiones periódicas</li>
                                <li>Limpieza de filtros</li>
                                <li>Recarga de gas refrigerante</li>
                                <li>Informes técnicos</li>
                            </ul>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🏢</div>
                            <h3>Proyectos Comerciales</h3>
                            <p>Diseño e instalación de sistemas de climatización para locales comerciales y oficinas.</p>
                            <ul className={styles.serviceFeatures}>
                                <li>Estudios de climatización</li>
                                <li>Instalaciones VRV/VRF</li>
                                <li>Conductos y rejillas</li>
                                <li>Certificaciones energéticas</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className={styles.whyUs}>
                    <h2>¿Por qué elegirnos?</h2>
                    <div className={styles.whyUsGrid}>
                        <div className={styles.whyUsItem}>
                            <span className={styles.whyUsNumber}>10+</span>
                            <p>Años de experiencia</p>
                        </div>
                        <div className={styles.whyUsItem}>
                            <span className={styles.whyUsNumber}>500+</span>
                            <p>Clientes satisfechos</p>
                        </div>
                        <div className={styles.whyUsItem}>
                            <span className={styles.whyUsNumber}>24h</span>
                            <p>Servicio de urgencias</p>
                        </div>
                        <div className={styles.whyUsItem}>
                            <span className={styles.whyUsNumber}>100%</span>
                            <p>Garantía en trabajos</p>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className={styles.contactCta}>
                    <h2>¿Necesitas un presupuesto?</h2>
                    <p>Contacta con nosotros y te atenderemos sin compromiso</p>
                    <div className={styles.contactInfo}>
                        <a href="tel:+34900000000" className={styles.contactButton}>
                            📞 900 000 000
                        </a>
                        <a href="mailto:info@uniclima.es" className={styles.contactButton}>
                            ✉️ info@uniclima.es
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}