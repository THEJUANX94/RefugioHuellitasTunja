// src/pages/HomePage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; // Para la navegación
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/style_home.css";

const HomePage = () => {
    const [pets, setPets] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let años = hoy.getFullYear() - nacimiento.getFullYear();
        let meses = hoy.getMonth() - nacimiento.getMonth();

        if (meses < 0) {
            años--;
            meses += 12;
        }

        return `${años} año(s) y ${meses} mes(es)`;
    };

    const fetchPets = async () => {
        try {
            const response = await fetch('http://localhost:4000/petsavailable');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const limitedPets = data.slice(0, 4);

            // Fetch images for each pet
            const petsWithImages = await Promise.all(limitedPets.map(async (pet) => {
                try {
                    const imageResponse = await fetch(`http://localhost:4000/images/${pet.idpet}`);
                    if (!imageResponse.ok) {
                        throw new Error(`Failed to fetch images for pet ID: ${pet.idpet}`);
                    }
                    const images = await imageResponse.json();
                    return {
                        ...pet,
                        imagen: images.length > 0 ? images[0].linkimage : null // Usamos 'imagen' en lugar de 'image'
                    };
                } catch (error) {
                    console.error(`Error fetching images for pet ID: ${pet.idpet}`, error);
                    return { ...pet, image: null };
                }
            }));

            setPets(petsWithImages);
        } catch (error) {
            console.error("Error fetching pets:", error);
            setError("Failed to fetch pets. Please check the server or the network.");
        } finally {
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);


    const manejarDetalle = (id) => {
        navigate(`/adopt/pet-detail/${id}`);
    };

    return (
        <>
            <Header />
            <div className="home-container">
                {/* Hero Section */}
                <section className="home-hero">
                    <div className="home-hero-content">
                        <h1 className="home-title">Encuentra el compañero perfecto para ti</h1>
                        <p className="home-description">
                            Adopta, dona o apoya nuestra causa. Cada pequeña acción puede cambiar la vida
                            de nuestros amigos peludos.
                        </p>
                        <button className="cta-button" onClick={() => navigate('/adopt')}>
                            Explorar Mascotas
                        </button>
                    </div>
                    <div className="home-hero-image">
                        <img
                            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Perro feliz en adopción"
                            className="responsive-image"
                        />
                    </div>
                </section>

                {/* Servicios */}
                <section className="home-services">
                    <h2 className="section-title">Nuestros Servicios</h2>
                    <div className="home-services-container">
                        <div className="service-card" onClick={() => navigate('/adopt')}>
                            <img
                                src="https://static.fundacion-affinity.org/cdn/farfuture/wfzHUAPksUOWePuvajegv_W_DwdxDophyz5qyiV1EiY/mtime:1528830294/sites/default/files/la-adopcion-una-nueva-oportunidad-a-las-mascotas-abandonadas.jpg"
                                alt="Adopción"
                            />
                            <h3>Adopción</h3>
                        </div>
                        <div className="service-card" onClick={() => navigate('/store')}>
                            <img
                                src="https://images.unsplash.com/photo-1516453734593-8d198ae84bcf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Tienda"
                            />
                            <h3>Tienda</h3>
                        </div>
                        <div className="service-card" onClick={() => navigate('/donate')}>
                            <img
                                src="https://images.pexels.com/photos/271168/pexels-photo-271168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="Donaciones"
                            />
                            <h3>Donaciones</h3>
                        </div>
                    </div>
                </section>

                {/* Tienda */}
                <section className="home-store">
                    <div className="home-store-content">
                        <div className="home-store-text">
                            <h2 className="section-title">Visita nuestra tienda</h2>
                            <p>
                                Aquí encontrarás alimento, juguetes y otros productos esenciales para
                                cuidar a tu amigo peludo. Cada compra ayuda a apoyar nuestra causa y a los
                                animales que más lo necesitan.
                            </p>
                            <button className="cta-button" onClick={() => navigate('/store')}>
                                Visitar Tienda
                            </button>
                        </div>
                        <div className="home-store-image">
                            <img
                                src="https://media.istockphoto.com/id/612739772/es/foto/lindo-frontera-collie-con-gran-mascota-huesos-en-la-tienda-de-mascotas.jpg?s=612x612&w=0&k=20&c=Ccd_04t6rD0uIll-cpaosdQQBvWSLzVW0qcH-7QnKfc="
                                alt="Productos en la tienda"
                                className="about-us-image "
                            />
                        </div>
                    </div>
                </section>

                {/* Mascotas Disponibles */}
                <section className="home-pets">
                    <h2 className="section-title">Mascotas Disponibles para Adopción</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="home-pets-grid">
                        {pets.map((pet) => (
                            <div key={pet.idpet} className="pet-card">
                                <img
                                    src={pet.imagen}
                                    alt={pet.name}
                                />
                                <h3>{pet.name}</h3>
                                <p>Edad:  {calcularEdad(pet.birthday)}</p>
                                <button className="cta-button" onClick={() => manejarDetalle(pet.idpet)}>
                                    Conocer Más
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Apóyanos con tu donación */}
                <section className="home-support">
                    <div className="home-support-content">
                        <div className="home-support-text">
                            <h2 className="section-title">Apóyanos con tu donación</h2>
                            <p>
                                Con tu donación, ayudas a cambiar la vida de miles de animales que esperan
                                un hogar. Aceptamos transferencias, tarjetas de crédito y otras formas de
                                pago.
                            </p>
                        </div>
                        <div className="home-support-image">
                            <img
                                src="https://st2.depositphotos.com/1146092/5837/i/450/depositphotos_58371397-stock-photo-donation-box-dog.jpg"
                                alt="Apoyo y donaciones"
                            />
                        </div>

                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
