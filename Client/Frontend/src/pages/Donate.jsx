import React from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/style_donate.css";

const DonatePage = () => {
    const navigate = useNavigate();

    const handleDonateNow = () => {
        navigate('/donate-form');
    };

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
                    </div>
                    <div className="donate-hero-image">
                        <div className="placeholder-image"></div>
                    </div>
                </section>

                <section className="donate-impact">
                    <h3 className="section-title">¿Por qué donar?</h3>
                    <div className="impact-cards">
                        <div className="impact-card rescue">
                            <div className="card-text">
                                <h3>Rescate y cuidado</h3>
                                <p>
                                    Ayudas a proporcionar atención veterinaria, refugio y alimento
                                    a animales en situación de abandono.
                                </p>
                            </div>
                            <div className="card-image">
                                <img src="https://cdn.milenio.com/uploads/media/2021/08/31/ciudad-mexico-sacrifican-nueve-perros.jpg" alt="Rescate y cuidado" />
                            </div>
                        </div>
                        <div className="impact-card adoption">
                            <div className="card-text">
                                <h3>Campañas de adopción</h3>
                                <p>
                                    Tus donaciones permiten realizar eventos de adopción para
                                    encontrar hogares amorosos.
                                </p>
                            </div>
                            <div className="card-image">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgjJdPyAXQdGoG9qupkISxlf2sGKOEvwUR4Q&s" alt="Campañas de adopción" />
                            </div>
                        </div>
                        <div className="impact-card education">
                            <div className="card-text">
                                <h3>Educación y conciencia</h3>
                                <p>
                                    Ayudamos a educar a la comunidad sobre la importancia de la
                                    adopción y el cuidado responsable.
                                </p>
                            </div>
                            <div className="card-image">
                                <img src="https://www.educacionbogota.edu.co/portal_institucional/sites/default/files/2019-06/N1_311.jpg" alt="Educación y conciencia" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Donation Methods */}
                <section className="donation-methods">
                    <h2 className="section-title">Formas de donar</h2>
                    <div className="methods">
                        <div className="method">
                            <div className="placeholder-image">
                                <img
                                    src="https://img.freepik.com/vector-gratis/mano-sujetando-telefono-servicio-billetera-digital-enviando-dinero-transaccion-pago-o-transferencia-traves-ilustracion-plana-aplicacion-movil_74855-20589.jpg?semt=ais_hybrid"
                                    alt="Donar"
                                    className="donate-image"
                                />
                            </div>
                            <h3>Transferencia Bancaria</h3>
                            <p>
                                Realiza tu donación directamente a nuestra cuenta bancaria.
                                Escríbenos para más detalles.
                            </p>
                        </div>
                        <div className="method">
                            <div className="placeholder-image">
                                <img
                                    src="https://www.unotv.com/uploads/2022/11/buen-fin-2022-condusef-explica-que-tipos-de-pagos-se-aceptan-en-internet-163727.jpg"
                                    alt="Donar"
                                    className="donate-image"
                                />
                            </div>
                            <h3>Pago en Línea</h3>
                            <p>
                                Usa nuestras plataformas de pago seguras para realizar tu
                                donación con tarjeta de crédito o débito.
                            </p>
                        </div>
                        <div className="method">
                            <div className="placeholder-image">
                                <img
                                    src="https://www.shutterstock.com/image-vector/adorable-pets-holds-empty-bowls-600nw-2290215819.jpg"
                                    alt="Donar"
                                    className="donate-image"
                                />
                            </div>
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
                    <button className="cta-button" onClick={handleDonateNow}>
                        Donar Ahora
                    </button>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default DonatePage;
