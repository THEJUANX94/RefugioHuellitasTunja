import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import './css/style_adopt.css';

const Adopt = () => {
    const [openFilters, setOpenFilters] = useState({
        edad: false,
        especies: false,
        raza: false
    });
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [species, setSpecies] = useState([]);
    const [selectedSpecies, setSelectedSpecies] = useState("");
    const [races, setRaces] = useState([]);
    const [selectedRace, setSelectedRace] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const petsPerPage = 9;

    const navigate = useNavigate();

    // Fetch Pets and their associated images
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch('http://localhost:4000/petsavailable');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Fetch images for each pet
                const petsWithImages = await Promise.all(data.map(async (pet) => {
                    try {
                        const imageResponse = await fetch(`http://localhost:4000/images/${pet.idpet}`);
                        if (!imageResponse.ok) {
                            throw new Error(`Failed to fetch images for pet ID: ${pet.idpet}`);
                        }
                        const images = await imageResponse.json();
                        return { ...pet, images: images.length > 0 ? images[0].linkimage : null };
                    } catch (error) {
                        console.error(`Error fetching images for pet ID: ${pet.idpet}`, error);
                        return { ...pet, images: null };
                    }
                }));

                setPets(petsWithImages);
                setFilteredPets(petsWithImages);
            } catch (error) {
                console.error("Error fetching pets:", error);
                alert("Failed to fetch pets. Please check the server or the network.");
            }
        };

        const fetchSpecies = async () => {
            try {
                const response = await fetch('http://localhost:4000/species');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSpecies(data);
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        };

        fetchPets();
        fetchSpecies();
    }, []);

    useEffect(() => {
        const fetchRaces = async () => {
            if (!selectedSpecies) {
                setRaces([]);
                setSelectedRace("");
                return;
            }
            try {
                const response = await fetch(`http://localhost:4000/races/${selectedSpecies}`);
                const data = await response.json();
                setRaces(data);
                setSelectedRace("");
            } catch (error) {
                console.error("Error fetching races by species:", error);
            }
        };

        fetchRaces();
    }, [selectedSpecies]);

    useEffect(() => {
        let result = pets;
        if (selectedSpecies) {
            result = result.filter(pet => pet.idspecies === selectedSpecies);
        }
        if (selectedRace) {
            result = result.filter(pet => pet.race === selectedRace);
        }
        setFilteredPets(result);
    }, [selectedSpecies, selectedRace, pets]);

    // Function to calculate age from birthday
    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Calculate pagination
    const indexOfLastPet = currentPage * petsPerPage;
    const indexOfFirstPet = indexOfLastPet - petsPerPage;
    const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredPets.length / petsPerPage);

    const toggleFilter = (filter) => {
        setOpenFilters((prevState) => ({
            ...prevState,
            [filter]: !prevState[filter]
        }));
    };

    return (
        <>
            <Header />
            <div className='background'>
                <div className='title'>
                    <h1>¿Estás buscando un nuevo amigo?</h1>
                    <p>Todos ellos están listos para su adopción</p>
                </div>
            </div>

            <div className="adopt-container">
                <div className="filters-panel">
                    <div className='color-filters'>
                        <div className="filters-header">
                            <h3>Filtros</h3>
                            <button className="clear-filters" onClick={() => {
                                setSelectedSpecies("");
                                setSelectedRace("");
                            }}>Limpiar todo</button>
                        </div>
                        <div className="filter-group">
                            <label className="filter-label" onClick={() => toggleFilter('especies')}>
                                Especies
                                <FaChevronDown className={`filter-arrow ${openFilters.especies ? 'open' : ''}`} />
                            </label>
                            {openFilters.especies && (
                                <ul className="filter-options">
                                    {species.map(spec => (
                                        <li key={spec.idspecies}>
                                            <input
                                                type="radio"
                                                name="species"
                                                value={spec.idspecies}
                                                checked={selectedSpecies === spec.idspecies}
                                                onChange={() => setSelectedSpecies(spec.idspecies)}
                                            />
                                            {spec.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="filter-group">
                            <label className="filter-label" onClick={() => toggleFilter('raza')}>
                                Raza
                                <FaChevronDown className={`filter-arrow ${openFilters.raza ? 'open' : ''}`} />
                            </label>
                            {openFilters.raza && (
                                <ul className="filter-options">
                                    {races.map((race, index) => (
                                        <li key={index}>
                                            <input
                                                type="radio"
                                                name="race"
                                                value={race.race}
                                                checked={selectedRace === race.race}
                                                onChange={() => setSelectedRace(race.race)}
                                            />
                                            {race.race}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pets-section">
                    <div className="search-bar">
                        <div className="input-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="search-input"
                            />
                        </div>
                        <button className="search-button">Buscar</button>
                    </div>
                    <h2>Resultados</h2>
                    <div className="pets-grid">
                        {currentPets.map((pet, index) => (
                            <div className="pet-card" key={pet.idpet || index}>
                                <img
                                    src={pet.images || `https://via.placeholder.com/150?text=${pet.name}`}
                                    alt={pet.name}
                                    className="pet-image"
                                />
                                <h3>{pet.name}</h3>
                                <p><strong>Edad:</strong> {calculateAge(pet.birthday)} años</p>
                                <button className="adopt-button" onClick={() => navigate(`/adopt/pet-detail/${pet.idpet}`)}>Conocer más</button>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            &laquo;
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? "active" : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            &raquo;
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Adopt;
