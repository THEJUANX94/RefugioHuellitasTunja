import React, { useState } from 'react';
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

    const toggleFilter = (filter) => {
        setOpenFilters((prevState) => ({
            ...prevState,
            [filter]: !prevState[filter]
        }));
    };

    const navigate = useNavigate();

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
                            <button className="clear-filters">Limpiar todo</button>
                        </div>
                        <div className="filter-group">
                            <label className="filter-label" onClick={() => toggleFilter('edad')}>
                                Edad
                                <FaChevronDown className={`filter-arrow ${openFilters.edad ? 'open' : ''}`} />
                            </label>
                            {openFilters.edad && (
                                <ul className="filter-options">
                                    <li><input type="checkbox" /> Cachorro</li>
                                    <li><input type="checkbox" /> Adulto</li>
                                    <li><input type="checkbox" /> Abuelo</li>
                                </ul>
                            )}
                        </div>

                        <div className="filter-group">
                            <label className="filter-label" onClick={() => toggleFilter('especies')}>
                                Especies
                                <FaChevronDown className={`filter-arrow ${openFilters.especies ? 'open' : ''}`} />
                            </label>
                            {openFilters.especies && (
                                <ul className="filter-options">
                                    <li><input type="checkbox" /> Perros</li>
                                    <li><input type="checkbox" /> Gatos</li>
                                    <li><input type="checkbox" /> Hámsters</li>
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
                                    <li><input type="checkbox" /> Pastor Alemán</li>
                                    <li><input type="checkbox" /> Siamés</li>
                                    <li><input type="checkbox" /> Labrador</li>
                                </ul>
                            )}
                        </div>
                        <button className="apply-filters">Aplicar filtros</button>
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
                        {[...Array(9)].map((_, index) => (
                            <div className="pet-card" key={index}>
                                <img src={`https://via.placeholder.com/150?text=Mascota+${index + 1}`} alt={`Mascota ${index + 1}`} className="pet-image" />
                                <h3>Enzo</h3>
                                <p><strong>Genrro:</strong> Macho</p>
                                <p><strong>Edad:</strong> 1 año</p>
                                <button className="adopt-button" onClick={() => navigate('/adopt/pet-detail')}>Conocer más</button>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button>&laquo;</button>
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>&raquo;</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Adopt;
