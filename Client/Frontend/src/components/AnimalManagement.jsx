import React, { useState, useEffect } from 'react';

const AnimalManagement = () => {
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [species, setSpecies] = useState([]);
    const [races, setRaces] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedSpecies, setSelectedSpecies] = useState("");
    const [selectedRace, setSelectedRace] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showSpeciesModal, setShowSpeciesModal] = useState(false);
    const [showRaceModal, setShowRaceModal] = useState(false);
    const [newSpeciesName, setNewSpeciesName] = useState("");
    const [newRaceName, setNewRaceName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentPetId, setCurrentPetId] = useState(null);
    const [previewImages, setPreviewImages] = useState([]); // Para previsualizar imágenes seleccionadas
    const [existingImages, setExistingImages] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        birthday: "",
        idspecies: "",
        race: "",
        details: "",
        images: []
    });

    // Fetch pets, species, and races on load
    const fetchSpecies = async () => {
        try {
            const response = await fetch('http://localhost:4000/species');
            if (!response.ok) {
                throw new Error(`HTTP error while fetching species! Status: ${response.status}`);
            }
            const data = await response.json();
            setSpecies(data);
        } catch (error) {
            console.error("Error fetching species:", error);
        }
    };

    // Función para obtener mascotas
    const fetchPets = async () => {
        try {
            const response = await fetch('http://localhost:4000/pets');
            if (!response.ok) {
                throw new Error(`HTTP error while fetching pets! Status: ${response.status}`);
            }
            const data = await response.json();
            setPets(data);
            setFilteredPets(data);
        } catch (error) {
            console.error("Error fetching pets:", error);
            alert("Failed to fetch pets. Please check the server or the network.");
        }
    };

    // useEffect para obtener especies y mascotas al cargar el componente
    useEffect(() => {
        const fetchSpeciesAndPets = async () => {
            await fetchSpecies(); // Obtener especies
            await fetchPets();    // Obtener mascotas
        };
        fetchSpeciesAndPets();
    }, []);

    // Fetch races when a species is selected
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
        if (search) {
            result = result.filter(pet =>
                pet.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (selectedSpecies) {
            result = result.filter(pet => pet.idspecies === selectedSpecies);
        }
        if (selectedRace) {
            result = result.filter(pet => pet.race === selectedRace);
        }
        setFilteredPets(result);
    }, [search, selectedSpecies, selectedRace, pets]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 1) {
            alert("You can upload a maximum of 1 images.");
            return;
        }

        setPreviewImages(files.map(file => URL.createObjectURL(file)));
        setExistingImages([]);
        setFormData({ ...formData, images: files });
    };

    const handleDelete = async (idPet) => {
        try {
            const response = await fetch(`http://localhost:4000/pets/${idPet}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Error deleting pet.");
            alert("Pet deleted successfully!");
            setPets(pets.filter(pet => pet.idPet !== idPet));

            await fetchSpecies(); // Actualizar especies en caso de que afecte la lista
            await fetchPets();
        } catch (error) {
            console.error(error);
            alert("Failed to delete pet.");
        }
    };

    const handleEdit = async (pet) => {
        const formattedBirthday = pet.birthday ? pet.birthday.split('T')[0] : "";
        setFormData({
            ...pet,
            birthday: formattedBirthday,
            idspecies: pet.idspecies || "",
            race: pet.race || "",
            images: []
        });

        setCurrentPetId(pet.idpet);
        setIsEditing(true);
        setSelectedSpecies(pet.idspecies);
        setSelectedRace(pet.race);
        setShowModal(true);

        try {
            const response = await fetch(`http://localhost:4000/images/${pet.idpet}`);
            if (!response.ok) throw new Error("Error fetching images.");
            const data = await response.json();
            setExistingImages(data);
        } catch (error) {
            console.error("Error fetching existing images:", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.birthday || !formData.idspecies || !formData.race || !formData.details) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            if (isEditing) {
                // Editar la mascota
                const petRes = await fetch(`http://localhost:4000/pets/${currentPetId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        birthday: formData.birthday,
                        race: formData.race,
                        details: formData.details,
                    }),
                });

                if (!petRes.ok) throw new Error("Error updating pet.");

                if (formData.images.length > 0) {
                    const deleteResponse = await fetch(`http://localhost:4000/delete-image/${currentPetId}`, {
                        method: 'DELETE',
                    });
                    if (!deleteResponse.ok) throw new Error("Error deleting existing image.");
                    const formDataImg = new FormData();
                    formData.images.forEach((file) => formDataImg.append('image', file));
                    const uploadRes = await fetch(`http://localhost:4000/upload/${currentPetId}`, {
                        method: 'POST',
                        body: formDataImg,
                    });
                    if (!uploadRes.ok) throw new Error("Error uploading new image.");
                }

                alert("Pet updated successfully!");
                // Actualizar la lista de mascotas
                setPets(pets.map(pet => pet.idPet === currentPetId ? { ...formData, idPet: currentPetId } : pet));

                await fetchSpecies(); // Actualizar especies en caso de que afecte la lista
                await fetchPets();
            } else {
                // Crear la mascota
                const petRes = await fetch('http://localhost:4000/pets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idspecies: formData.idspecies,
                        name: formData.name,
                        birthday: formData.birthday,
                        race: formData.race,
                        details: formData.details,
                    }),
                });

                if (!petRes.ok) throw new Error("Error creating pet.");
                const { idPet } = await petRes.json();

                // Subir imágenes asociadas
                if (formData.images.length > 0) {
                    const formDataImg = new FormData();
                    formData.images.forEach((file) => formDataImg.append('image', file));

                    const uploadRes = await fetch(`http://localhost:4000/upload/${idPet}`, {
                        method: 'POST',
                        body: formDataImg,
                    });

                    if (!uploadRes.ok) throw new Error("Error uploading images.");
                }

                alert("Pet created successfully!");
                // Actualizar la lista de mascotas
                setPets([...pets, { ...formData, idPet }]);
            }

            // Resetear el formulario y cerrar el modal
            handleCloseModal();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to create/update pet. Please check the server or network.");
        }
    };

    const handleAddSpecies = async () => {
        try {
            const response = await fetch('http://localhost:4000/species', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSpeciesName }),
            });
            if (!response.ok) throw new Error("Error creating species.");
            const newSpecies = await response.json();
            setSpecies([...species, newSpecies]);
            setNewSpeciesName("");
            setFormData({ ...formData, idspecies: newSpecies.idspecies }); // Set the new species as selected
            setShowSpeciesModal(false);
        } catch (error) {
            console.error("Error adding species:", error);
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setShowModal(false);
        setFormData({
            name: "",
            birthday: "",
            idspecies: "",
            race: "",
            details: "",
            images: []
        });
        setSelectedSpecies("");
        setSelectedRace("");
        setIsEditing(false);
        setCurrentPetId(null);
        setPreviewImages([]); // Limpiar las previsualizaciones
        setExistingImages([]); // Limpiar imágenes existentes
    };

    const handleAddPet = () => {
        handleCloseModal(); // Limpiar estados previos
        setShowModal(true); // Mostrar el modal
    };
    return (
        <div>
            <h1>Animal Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    onChange={(e) => {
                        setSelectedSpecies(e.target.value); // Usar el idspecies
                    }}
                >
                    <option value="">Filter by Species</option>
                    {species.map(spec => (
                        <option key={spec.idspecies} value={spec.idspecies}>
                            {spec.name}
                        </option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedRace(e.target.value)} disabled={!selectedSpecies}>
                    <option value="">Filter by Race</option>
                    {races.map((race, index) => (
                        <option key={index} value={race.race}>{race.race}</option>
                    ))}
                </select> <br />
                <button onClick={handleAddPet}>Add New Pet</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Species</th>
                        <th>Race</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPets.map((pet, index) => (
                        <tr key={pet.idpet || index}>
                            <td>{pet.name}</td>
                            <td>{species.find(s => s.idspecies === pet.idspecies)?.name || "Unknown"}</td>
                            <td>{pet.race}</td>
                            <td>
                                {pet.details.length > 100
                                    ? `${pet.details.slice(0, 100)}...`
                                    : pet.details}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(pet)}>Edit</button>
                                <button onClick={() => handleDelete(pet.idpet)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>



            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <h2>{isEditing ? `Edit Pet: ${formData.name || ''}` : "Add New Pet"}</h2>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <label>Birthday</label>
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleInputChange}
                            />
                            <label>Species</label>
                            <select
                                name="idspecies"
                                value={formData.idspecies}
                                onChange={async (e) => {
                                    const selectedSpecies = e.target.value;
                                    setFormData({ ...formData, idspecies: selectedSpecies }); // Actualizar la especie en formData

                                    // Obtener razas para la especie seleccionada
                                    try {
                                        const response = await fetch(`http://localhost:4000/races/${selectedSpecies}`);
                                        if (!response.ok) throw new Error("Error fetching races.");
                                        const data = await response.json();
                                        setRaces(data); // Actualizar el estado de razas
                                    } catch (error) {
                                        console.error("Error fetching races:", error);
                                        setRaces([]); // Vaciar razas si ocurre un error
                                    }
                                }}
                            >
                                <option value="">Select Species</option>
                                {species.map((spec) => (
                                    <option key={spec.idspecies} value={spec.idspecies}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => setShowSpeciesModal(true)}>+</button>
                            <label>Race</label>
                            <select
                                name="race"
                                value={formData.race}
                                onChange={(e) => {
                                    setFormData({ ...formData, race: e.target.value }); // Actualizar la raza en formData
                                }}
                                disabled={!formData.idspecies} // Deshabilitar si no hay especie seleccionada
                            >
                                <option value="">Select Race</option>
                                {races.map((race, index) => (
                                    <option key={index} value={race.race}>
                                        {race.race}
                                    </option>
                                ))}
                                <option value={newRaceName} hidden={!newRaceName}>{newRaceName}</option>
                            </select>
                            <button type="button" onClick={() => setShowRaceModal(true)} disabled={!formData.idspecies}>+</button>
                            <label>Details</label>
                            <textarea
                                name="details"
                                placeholder="Details"
                                value={formData.details}
                                onChange={handleInputChange}
                            />
                            <label>Images</label>
                            <div className="image-preview-container">
                                {/* Previsualizar la nueva imagen seleccionada */}
                                {previewImages.map((src, index) => (
                                    <img key={index} src={src} alt={`Preview ${index + 1}`} className="preview-image" />
                                ))}
                                {/* Mostrar imágenes existentes solo al editar y si no hay nueva imagen */}
                                {isEditing && existingImages.length > 0 && previewImages.length === 0 && (
                                    existingImages.map((img, index) => (
                                        <img key={index} src={img.linkimage} alt={`Existing ${index + 1}`} className="preview-image" />
                                    ))
                                )}
                            </div>
                            <input type="file" multiple onChange={handleFileChange} />
                            <button type="submit">{isEditing ? "Update" : "Save"}</button>
                        </form>
                    </div>
                </div>
            )}

            {showSpeciesModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setShowSpeciesModal(false)}>&times;</button>
                        <h2>Add New Species</h2>
                        <input
                            type="text"
                            placeholder="Species Name"
                            value={newSpeciesName}
                            onChange={(e) => setNewSpeciesName(e.target.value)}
                        />
                        <button onClick={handleAddSpecies}>Add Species</button>
                    </div>
                </div>
            )}

            {showRaceModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setShowRaceModal(false)}>&times;</button>
                        <h2>Add New Race</h2>
                        <input
                            type="text"
                            placeholder="Race Name"
                            value={newRaceName}
                            onChange={(e) => setNewRaceName(e.target.value)}
                        />
                        <button onClick={() => {
                            setRaces([...races, { race: newRaceName }]);
                            setFormData({ ...formData, race: newRaceName });
                            setShowRaceModal(false);
                        }}>Add Race</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimalManagement;
