import React from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/style_donate.css";

const DonatePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="donate-container">
                {/* Hero Section */}
                <section className="donate-hero">
                    <div className="donate-hero-content">
                        <h1 className="donate-title">Tu ayuda salva vidas</h1>
                        <p className="donate-description">
                            Con tu apoyo, podemos seguir rescatando, cuidando y encontrando
                            hogares amorosos para miles de animales. Haz la diferencia hoy.
                        </p>
                        <NavLink to="/donate-form" className={({ isActive }) => isActive ? 'active' : ''}>Inicio</NavLink>
                    </div>
                    <div className="donate-hero-image">
                        <div className="placeholder-image"></div>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="donate-impact">
                    <h2 className="section-title">¿Por qué donar?</h2>
                    <div className="impact-cards">
                        <div className="impact-card">
                            <h3>Rescate y cuidado</h3>
                            <p>
                                Ayudas a proporcionar atención veterinaria, refugio y alimento
                                a animales en situación de abandono.
                            </p>
                        </div>
                        <div className="impact-card">
                            <h3>Campañas de adopción</h3>
                            <p>
                                Tus donaciones permiten realizar eventos de adopción para
                                encontrar hogares amorosos.
                            </p>
                        </div>
                        <div className="impact-card">
                            <h3>Educación y conciencia</h3>
                            <p>
                                Ayudamos a educar a la comunidad sobre la importancia de la
                                adopción y el cuidado responsable.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Donation Methods */}
                <section className="donation-methods">
                    <h2 className="section-title">Formas de donar</h2>
                    <div className="methods">
                        <div className="method">
                            <div className="placeholder-image"></div>
                            <h3>Transferencia Bancaria</h3>
                            <p>
                                Realiza tu donación directamente a nuestra cuenta bancaria.
                                Escríbenos para más detalles.
                            </p>
                        </div>
                        <div className="method">
                            <div className="placeholder-image"></div>
                            <h3>Pago en Línea</h3>
                            <p>
                                Usa nuestras plataformas de pago seguras para realizar tu
                                donación con tarjeta de crédito o débito.
                            </p>
                        </div>
                        <div className="method">
                            <div className="placeholder-image"></div>
                            <h3>Donación en Especie</h3>
                            <p>
                                Alimentos, medicamentos, collares... cualquier aporte en especie
                                ayuda enormemente.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="cta-section">
                    <h2>Haz tu donación ahora</h2>
                    <p>
                        Tu aporte puede marcar la diferencia en la vida de un animal que lo
                        necesita.
                    </p>
                    <button className="cta-button">Donar Ahora</button>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default DonatePage;
