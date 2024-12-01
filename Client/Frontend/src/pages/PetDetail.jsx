import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdoptionForm from "../components/AdoptionForm";
import './css/style_pet_detail.css';

const PetDetail = () => {
    const { id } = useParams(); // Obtener el ID de la mascota de la URL
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [images, setImages] = useState([]);
    const [speciesName, setSpeciesName] = useState("");
    const [isFormVisible, setFormVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPetData();
    }, []);

    // Fetch pet data by ID
    const fetchPetData = async () => {
        try {
            // Obtener los detalles de la mascota
            const petResponse = await fetch(`http://localhost:4000/pets/${id}`);
            if (!petResponse.ok) throw new Error("Error fetching pet data.");
            const petData = await petResponse.json();
            setPet(petData[0]);

            // Obtener el nombre de la especie
            const speciesResponse = await fetch(`http://localhost:4000/species`);
            if (!speciesResponse.ok) throw new Error("Error fetching species.");
            const speciesData = await speciesResponse.json();
            const species = speciesData.find(spec => spec.idspecies === petData[0].idspecies);
            setSpeciesName(species ? species.name : "Unknown");

            // Obtener las imágenes asociadas a la mascota
            const imagesResponse = await fetch(`http://localhost:4000/images/${id}`);
            if (!imagesResponse.ok) throw new Error("Error fetching images.");
            const imagesData = await imagesResponse.json();
            setImages(imagesData);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to fetch pet details. Please check the server or network.");
        }
    };

    const handleOpenForm = () => {
        setFormVisible(true);
    };

    const handleCloseForm = () => {
        setFormVisible(false);
    };

    const handleBack = () => {
        navigate(-1); // Regresa a la página anterior
    };

    if (!pet) {
        return <p>Loading pet details...</p>;
    }

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
                            src={images.length > 0 ? images[0].linkimage : "https://via.placeholder.com/640x470"}
                            alt={pet.name}
                            className="main-pet-image"
                        />
                        <div className="pet-gallery">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.linkimage}
                                    alt={`Imagen ${index + 1}`}
                                    className="gallery-image"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sección de Información */}
                    <div className="pet-info-section">
                        <h3 className="pet-name">Nombre</h3>
                        <p>{pet.name}</p>
                        <h3 className="pet-name">Especie</h3>
                        <p className="pet-detail">{speciesName}</p>
                        <h3 className="pet-name">Edad</h3>
                        <p className="pet-detail">{calculateAge(pet.birthday)}</p>
                        <h3 className="pet-name">Historia</h3>
                        <p>{pet.details}</p>
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

    // Calcular la edad de la mascota a partir de su fecha de nacimiento
    function calculateAge(birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age > 1 ? `${age} años` : `${age} año`;
    }
};

export default PetDetail;
