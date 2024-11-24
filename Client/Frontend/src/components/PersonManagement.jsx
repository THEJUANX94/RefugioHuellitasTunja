import React, { useEffect, useState } from 'react';

const PersonManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (login) => {
        try {
            await fetch(`http://localhost:4000/users/${login}`, { method: 'DELETE' });
            setUsers(users.filter(user => user.login !== login));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    return (
        <div>
            <h1>Gestión de Personas</h1>
            <button onClick={() => console.log('Abrir formulario de agregar persona')}>Agregar Persona</button>
            <table>
                <thead>
                    <tr>
                        <th>Login</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.login}>
                            <td>{user.login}</td>
                            <td>{user.nombre}</td>
                            <td>{user.correo}</td>
                            <td>{user.rol}</td>
                            <td>
                                <button onClick={() => console.log('Editar', user.login)}>Editar</button>
                                <button onClick={() => deleteUser(user.login)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonManagement;
