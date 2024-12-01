import React, { useState, useEffect } from 'react';

const AdoptionManagement = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [filteredAdoptions, setFilteredAdoptions] = useState([]); // Estado para adopciones filtradas
    const [selectedAdoption, setSelectedAdoption] = useState(null);
    const [formDetails, setFormDetails] = useState(null);
    const [filterState, setFilterState] = useState(''); // Estado para el filtro seleccionado
    const [selectedPet, setSelectedPet] = useState(null); // Información de la mascota seleccionada
    const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal

    const handleOpenModal = async (adoption) => {
        try {
            // Obtener los detalles de la mascota
            const petResponse = await fetch(`http://localhost:4000/pets/${adoption.idpet}`);
            const petData = await petResponse.json();
            const pet = petData[0];

            // Obtener la imagen de la mascota
            const imageResponse = await fetch(`http://localhost:4000/images/${adoption.idpet}`);
            const imageData = await imageResponse.json();

            // Obtener el nombre de la especie usando idspecies
            const speciesResponse = await fetch(`http://localhost:4000/species/${pet.idspecies}`);
            const speciesData = await speciesResponse.json();

            // Configurar la mascota seleccionada con todos los datos, incluyendo la especie
            setSelectedPet({
                petName: pet.name,
                birthday: pet.birthday,
                species: speciesData.name, // Nombre de la especie
                race: pet.race,
                details: pet.details,
                image: imageData.length > 0 ? imageData[0].linkimage : null, // Primera imagen o null
                idpet: pet.idpet,
            });
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching pet details:', error);
            alert('No se pudieron cargar los detalles de la mascota.');
        }
    };


    const handleCloseModalpet = () => {
        setSelectedPet(null); // Limpia la información de la mascota seleccionada
        setShowModal(false);  // Oculta el modal
    };

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        return new Date(date).toLocaleString('en-GB', options);
    };

    const translateState = (state) => {
        switch (state) {
            case 'A':
                return 'Aceptado';
            case 'D':
                return 'Denegado';
            case 'W':
                return 'En espera';
            default:
                return 'Desconocido';
        }
    };

    const fetchAdoptions = async () => {
        try {
            const response = await fetch('http://localhost:4000/adoptions');
            const adoptionData = await response.json();

            const adoptionDetails = await Promise.all(
                adoptionData.map(async (adoption) => {
                    const petResponse = await fetch(`http://localhost:4000/pets/${adoption.idpet}`);
                    const petData = await petResponse.json();

                    const formResponse = await fetch(`http://localhost:4000/form/${adoption.idform}`);
                    const formData = await formResponse.json();
                    const userResponse = await fetch(`http://localhost:4000/users/${formData.login}`);
                    const userData = await userResponse.json();

                    return {
                        ...adoption,
                        collectiondate: formatDate(adoption.collectiondate),
                        petName: petData[0]?.name || 'Sin nombre de mascota',
                        username: userData[0]?.name || 'Sin nombre de usuario',
                        formId: adoption.idform,
                    };
                })
            );

            setAdoptions(adoptionDetails);
            setFilteredAdoptions(adoptionDetails); // Inicialmente, mostramos todas las adopciones
        } catch (error) {
            console.error('Error al cargar las adopciones:', error);
        }
    };

    useEffect(() => {
        fetchAdoptions();
    }, []);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilterState(value);

        if (value === '') {
            setFilteredAdoptions(adoptions); // Mostrar todas las adopciones si no hay filtro
        } else {
            setFilteredAdoptions(adoptions.filter((adoption) => adoption.state === value));
        }
    };

    const handleViewForm = async (adoption) => {
        try {
            const response = await fetch(`http://localhost:4000/form/${adoption.formId}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del formulario');
            }
            const formData = await response.json();
            setFormDetails(formData.formData.record);
            setSelectedAdoption(adoption);
        } catch (error) {
            console.error('Error al cargar el formulario:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedAdoption(null);
        setFormDetails(null);
    };

    const updateAdoptionState = async (idpet, idform, newState) => {
        try {
            const response = await fetch(`http://localhost:4000/adoptions/${idpet}/${idform}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state: newState }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la adopción');
            }

            if (newState === 'A') {
                const denyOthersResponse = await fetch(`http://localhost:4000/adoptions/deny-others/${idpet}/${idform}`, {
                    method: 'PUT',
                });
                if (!denyOthersResponse.ok) {
                    throw new Error('Error al denegar otras solicitudes');
                }
            }

            alert(`Estado actualizado a ${newState === 'A' ? 'Aceptado' : 'Denegado'}`);
            fetchAdoptions(); // Recargar la tabla
        } catch (error) {
            console.error('Error actualizando el estado:', error);
        }
    };

    return (
        <div>
            <h2>Gestionar Adopciones</h2>

            {/* Filtro por estado */}
            <div>
                <label htmlFor="filterState">Filtrar por estado: </label>
                <select
                    id="filterState"
                    value={filterState}
                    onChange={handleFilterChange}
                >
                    <option value="">Todos</option>
                    <option value="W">En espera</option>
                    <option value="A">Aceptado</option>
                    <option value="D">Denegado</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre de la Mascota</th>
                        <th>Nombre del Usuario</th>
                        <th>Fecha de Adopción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAdoptions.map((adoption) => (
                        <tr key={`${adoption.idpet}-${adoption.idform}`}>
                            <td onClick={() => handleOpenModal(adoption)} className="pet-name-adopt">
                                {adoption.petName}
                            </td>
                            <td>{adoption.username}</td>
                            <td>{adoption.collectiondate}</td>
                            <td>{translateState(adoption.state)}</td>
                            <td>
                                <button onClick={() => handleViewForm(adoption)}>Ver Formulario</button>
                                {adoption.state === 'W' && (
                                    <>
                                        <button
                                            onClick={() => updateAdoptionState(adoption.idpet, adoption.idform, 'A')}
                                        >
                                            Aceptar
                                        </button>
                                        <button
                                            onClick={() => updateAdoptionState(adoption.idpet, adoption.idform, 'D')}
                                        >
                                            Denegar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedAdoption && formDetails && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Formulario solicitud de adopción mascota</h2>
                        <p className="form-description">
                            Estas preguntas fueron tomadas en cuenta para la aceptación de esta solicitud de adopción.
                        </p>

                        <form>
                            <h3>Datos Generales</h3>
                            <div className="form-group">
                                <label>Correo</label>
                                <input type="email" value={formDetails.email} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input type="tel" value={formDetails.phone} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input type="text" value={formDetails.fullName} readOnly />
                            </div>

                            <h3>Información sobre el estilo de vida</h3>
                            <div className="form-group">
                                <label>¿Quién más vive en el hogar?</label>
                                <div>
                                    {formDetails.household.map((member, index) => (
                                        <p key={index}>{member}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Responsable principal del cuidado</label>
                                <input type="text" value={formDetails.caretaker} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Tiempo en casa del responsable</label>
                                <input type="text" value={formDetails.caretakerTime} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Razón para adoptar</label>
                                <textarea value={formDetails.adoptionReason} readOnly />
                            </div>
                            <div className="form-group">
                                <label>¿Tiene un patio o jardín?</label>
                                <input type="text" value={formDetails.hasYard} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Compromiso con la mascota</label>
                                <input type="text" value={formDetails.responsibility} readOnly />
                            </div>
                            <div className="form-group">
                                <label>¿Alguien en la familia es alérgico?</label>
                                <input type="text" value={formDetails.allergy} readOnly />
                            </div>

                            <button type="button" onClick={handleCloseModal}>
                                Cerrar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showModal && selectedPet && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close" onClick={handleCloseModalpet}>
                            &times;
                        </button>
                        <h2>Detalles de la Mascota</h2>
                        <div className="modal-details">
                            {/* Imagen de la mascota */}
                            <img
                                src={selectedPet.image || `https://via.placeholder.com/150?text=${selectedPet.petName}`}
                                alt={selectedPet.petName}
                                className="preview-image"
                            />
                            {/* Información de la mascota */}
                            <div className="modal-text">
                                <p><strong>Nombre:</strong> {selectedPet.petName}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {selectedPet.birthday || 'No disponible'}</p>
                                <p><strong>Especie:</strong> {selectedPet.species || 'No especificada'}</p>
                                <p><strong>Raza:</strong> {selectedPet.race || 'No especificada'}</p>
                                <p><strong>Detalles:</strong> {selectedPet.details || 'Sin información adicional'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdoptionManagement;
