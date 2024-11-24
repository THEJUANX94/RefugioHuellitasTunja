import React, { useEffect, useState } from 'react';

const AnimalManagement = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch('http://localhost:4000/pets');
                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error('Error al obtener animales:', error);
            }
        };

        fetchPets();
    }, []);

    const deletePet = async (idpet) => {
        try {
            await fetch(`http://localhost:4000/pets/${idpet}`, { method: 'DELETE' });
            setPets(pets.filter(pet => pet.idpet !== idpet));
        } catch (error) {
            console.error('Error al eliminar animal:', error);
        }
    };

    return (
        <div>
            <h1>Gestión de Animales</h1>
            <button onClick={() => console.log('Abrir formulario de agregar animal')}>Agregar Animal</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Especie</th>
                        <th>Edad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map(pet => (
                        <tr key={pet.idpet}>
                            <td>{pet.idpet}</td>
                            <td>{pet.nombre}</td>
                            <td>{pet.especie}</td>
                            <td>{pet.edad}</td>
                            <td>
                                <button onClick={() => console.log('Editar', pet.idpet)}>Editar</button>
                                <button onClick={() => deletePet(pet.idpet)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnimalManagement;
