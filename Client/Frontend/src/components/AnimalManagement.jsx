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
    const [formData, setFormData] = useState({
        name: "",
        birthday: "",
        idspecies: "",
        race: "",
        details: "",
        images: []
    });

    // Fetch pets, species, and races on load
    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await fetch('http://localhost:4000/species');
                const data = await response.json();
                setSpecies(data);
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        };

        const fetchPets = async () => {
            try {
                const response = await fetch('http://localhost:4000/pets');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPets(data);
                setFilteredPets(data);
            } catch (error) {
                console.error("Error fetching pets:", error);
                alert("Failed to fetch pets. Please check the server or the network.");
            }
        };

        fetchSpecies().then(fetchPets); // Fetch species first, then pets
    }, []);

    // Fetch races when a species is selected
    useEffect(() => {
        const fetchRaces = async () => {
            if (!selectedSpecies) {
                setRaces([]);
                return;
            }
            try {
                const response = await fetch(`http://localhost:4000/races/${selectedSpecies}`);
                const data = await response.json();
                setRaces(data);
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
        if (files.length > 4) {
            alert("You can upload a maximum of 4 images.");
            return;
        }
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
        } catch (error) {
            console.error(error);
            alert("Failed to delete pet.");
        }
    };

    const handleEdit = (pet) => {
        setFormData({
            ...pet,
            idspecies: pet.idspecies || "",
            images: [] // Reset images for editing
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.birthday || !formData.idspecies || !formData.race || !formData.details) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
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
            const { idPet } = await petRes.json(); // Obtener el ID de la mascota creada

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

            // Resetear el formulario y cerrar el modal
            setShowModal(false);
            setFormData({
                name: "",
                birthday: "",
                idspecies: "",
                race: "",
                details: "",
                images: [],
            });

            // Actualizar lista de mascotas
            setPets([...pets, { ...formData, idPet }]);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to create pet. Please check the server or network.");
        }
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
                </select>
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
                        <tr key={pet.idPet || index}>
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
                                <button onClick={() => handleDelete(pet.idPet)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => setShowModal(true)}>Add New Pet</button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setShowModal(false)}>
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <h2>Add or Edit Pet</h2>
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
                            </select>
                            <label>Details</label>
                            <textarea
                                name="details"
                                placeholder="Details"
                                value={formData.details}
                                onChange={handleInputChange}
                            />
                            <label>Images</label>
                            <input type="file" multiple onChange={handleFileChange} />
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimalManagement;
