import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/style_about_us.css';

const AboutUs = () => {
    return (
        <>
            <Header />
            <div className="about-us">
                {/* Sección Nosotros */}
                <section className="about-us-section">
                    <h1 className="about-us-title">Nosotros</h1>
                    <div className="about-us-content">
                        <img
                            src="https://via.placeholder.com/600x400"
                            alt="Equipo Refugio Huellitas Tunja"
                            className="about-us-image"
                        />
                        <div className="about-us-text">
                            <h2 className="about-us-subtitle">Misión</h2>
                            <p>
                                En Refugio Huellitas Tunja, trabajamos con el propósito de proteger, rescatar y rehabilitar
                                animales en situación de abandono o maltrato. Nos enfocamos en promover la adopción responsable
                                y generar conciencia sobre la tenencia adecuada de mascotas. Creemos en el respeto por la vida
                                animal y en construir una sociedad más empática y solidaria con quienes no tienen voz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sección Visión y Cifras */}
                <section className="about-us-section about-us-grid">
                    <div className="about-us-card">
                        <h2 className="about-us-subtitle">Visión</h2>
                        <p>
                            Aspiramos a ser un referente en Boyacá y a nivel nacional, promoviendo la cultura de adopción y la
                            responsabilidad hacia los animales. Nuestro objetivo es impactar positivamente en la calidad de vida
                            de miles de perros y gatos, mientras sensibilizamos a la comunidad sobre el valor de cada vida animal.
                        </p>
                    </div>
                    <img
                        src="https://via.placeholder.com/400x300"
                        alt="Actividades Refugio Huellitas Tunja"
                        className="about-us-image"
                    />
                    <img
                        src="https://via.placeholder.com/400x300"
                        alt="Cifras Refugio Huellitas Tunja"
                        className="about-us-image"
                    />
                    <div className="about-us-card">
                        <h2 className="about-us-subtitle">Cifras</h2>
                        <p><strong>Cifras actualizadas al 2023:</strong></p>
                        <ul>
                            <li>Más de 1200 perros y gatos rescatados, rehabilitados y entregados en adopciones responsables.</li>
                            <li>Más de 2000 animales esterilizados, promoviendo el control poblacional.</li>
                            <li>Más de 800 jornadas educativas y campañas de sensibilización en colegios, empresas y comunidades.</li>
                        </ul>
                    </div>
                </section>

                {/* Sección Historia */}
                <section className="about-us-section">
                    <h2 className="about-us-subtitle">Historia</h2>
                    <div className="about-us-content">
                        <div className="about-us-text">
                            <p>
                                Refugio Huellitas Tunja nació en el año 2015 como un sueño de un grupo de voluntarios que deseaban
                                hacer la diferencia en la vida de animales en situación de abandono. Comenzamos con recursos limitados,
                                pero con una enorme motivación por ayudar. A lo largo de los años, hemos crecido gracias al apoyo de
                                donantes, adoptantes responsables y una comunidad comprometida con la causa animalista.
                            </p>
                        </div>
                        <img
                            src="https://via.placeholder.com/600x400"
                            alt="Historia Refugio Huellitas Tunja"
                            className="about-us-image"
                        />
                    </div>
                </section>

                {/* Sección Meta */}
                <section className="about-us-section">
                    <h2 className="about-us-subtitle">Meta</h2>
                    <div className="about-us-content">
                        <img
                            src="https://via.placeholder.com/600x400"
                            alt="Meta Refugio Huellitas Tunja"
                            className="about-us-image"
                        />
                        <div className="about-us-text">
                            <p><strong>Para el 2025 queremos lograr:</strong></p>
                            <ul>
                                <li>Organizar 15 campañas de esterilización y vacunación en comunidades rurales de Boyacá.</li>
                                <li>Incrementar en un 50% las adopciones responsables a través de ferias y eventos.</li>
                                <li>Implementar programas educativos en colegios para enseñar a niños y jóvenes sobre el cuidado animal.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
