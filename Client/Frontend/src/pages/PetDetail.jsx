import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdoptionForm from "../components/AdoptionForm";
import './css/style_pet_detail.css';

const PetDetail = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // Desplaza la página al inicio al cargarla
    }, []);

    const navigate = useNavigate();
    const [isFormVisible, setFormVisible] = useState(false);

    const handleOpenForm = () => {
        setFormVisible(true);
    };

    const handleCloseForm = () => {
        setFormVisible(false);
    };

    const handleBack = () => {
        navigate(-1); // Regresa a la página anterior
    };

    return (
        <>
            <Header />
            <div className="pet-detail-container">
                <div className="back-button-container">
                    <button className="back-button" onClick={handleBack}>
                        <FiArrowLeft className="back-icon" /> Regresar
                    </button>
                </div>
                <div className="pet-detail-content">
                    {/* Sección de Imagen */}
                    <div className="pet-image-section">
                        <img
                            src="https://via.placeholder.com/640x470"
                            alt="Tobby"
                            className="main-pet-image"
                        />
                        <div className="pet-gallery">
                            {[...Array(4)].map((_, index) => (
                                <img
                                    key={index}
                                    src={`https://via.placeholder.com/100x100?text=Img${index + 1}`}
                                    alt={`Img ${index + 1}`}
                                    className="gallery-image"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sección de Información */}
                    <div className="pet-info-section">
                        <h3 className="pet-name">Nombre</h3>
                        <p>Tobby</p>
                        <h3 className="pet-name">Genero</h3>
                        <p className="pet-detail"> Macho</p>
                        <h3 className="pet-name">Edad</h3>
                        <p className="pet-detail">6 Meses</p>
                        <h3 className="pet-name">Historia</h3>
                        <p>
                            Mediano fue encontrado en las calles de Malambo, Atlántico cuando se refugiaban en una zanja
                            junto a su mamá y sus otros hermanos. De inmediato los rescatamos y fueron llevados a la
                            veterinaria para una atención médica prioritaria.
                        </p>
                        <p>
                            Desafortunadamente su mamá falleció luchando contra un virus muy fuerte (distemper canino)
                            dejando a Tobby y sus otros 5 hermanos a su suerte.
                        </p>
                        <button className="form-button" onClick={handleOpenForm}>
                            Formulario de adopción
                        </button>
                        {isFormVisible && <AdoptionForm onClose={handleCloseForm} />}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PetDetail;
