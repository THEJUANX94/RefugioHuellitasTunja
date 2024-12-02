import React, { useEffect, useState } from 'react';
import './css/style_personManagement.css';

const PersonManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [alertMessage, setAlertMessage] = useState(''); // Mensajes de éxito o error
    const [newUser, setNewUser] = useState({
        login: '',
        name: '',
        lastname: '',
        type: '',
        phonenumber: '',
        email: '',
        address: '',
        password: '',
    });

    // Cargar usuarios al montar el componente
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtrar usuarios según búsqueda y rol
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (roleFilter === '' || user.type === roleFilter)
    );

    // Manejar cambios en el formulario
    const handleFormChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // Abrir formulario para agregar o editar usuario
    const openForm = (user = null) => {
        if (user) {
            setNewUser(user); // Prellenar campos con los datos del usuario
            setIsEditing(true);
        } else {
            resetForm();
            setIsEditing(false);
        }
        setShowForm(true);
    };

    // Cerrar formulario y resetear estado
    const closeForm = () => {
        setShowForm(false);
        resetForm();
    };

    // Guardar cambios (Agregar o Editar)
    const handleSaveUser = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                // Editar usuario
                const response = await fetch(`http://localhost:4000/users/${newUser.login}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newUser.name,
                        lastname: newUser.lastname,
                        type: newUser.type,
                        phonenumber: newUser.phonenumber,
                        email: newUser.email,
                        address: newUser.address,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error al editar usuario: ${errorData.error || response.statusText}`);
                }

                setAlertMessage('Usuario editado exitosamente.');
            } else {
                // Agregar nuevo usuario
                await fetch('http://localhost:4000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        login: newUser.login,
                        password: newUser.password,
                    }),
                });

                const response = await fetch('http://localhost:4000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        login: newUser.login,
                        name: newUser.name,
                        lastname: newUser.lastname,
                        type: newUser.type,
                        phonenumber: newUser.phonenumber,
                        email: newUser.email,
                        address: newUser.address,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error al agregar usuario: ${errorData.error || response.statusText}`);
                }

                setAlertMessage('Usuario creado exitosamente.');
            }

            closeForm();
            fetchUsers();
        } catch (error) {
            console.error('Error al guardar usuario:', error.message);
        }
    };

    // Eliminar usuario
    const deleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/${userToDelete}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            setAlertMessage('Usuario eliminado exitosamente.');
            setUsers(users.filter(user => user.login !== userToDelete));
            setUserToDelete(null);
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
        }
    };

    // Resetear formulario
    const resetForm = () => {
        setNewUser({
            login: '',
            name: '',
            lastname: '',
            type: '',
            phonenumber: '',
            email: '',
            address: '',
            password: '',
        });
    };

    return (
        <div className="person-management-container">
            <h1>Gestión de Personas</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">Todos los roles</option>
                    <option value="A">Admin</option>
                    <option value="E">Empleado</option>
                    <option value="C">Cliente</option>
                </select><br />
                <button onClick={() => openForm()}>Agregar Persona</button>
            </div>

            {/* Modal para agregar o editar usuario */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Editar Persona' : 'Agregar Persona'}</h2>
                        <form onSubmit={handleSaveUser}>
                            <label>Login</label>
                            <input
                                type="text"
                                name="login"
                                placeholder="Login"
                                value={newUser.login}
                                onChange={handleFormChange}
                                disabled={isEditing}
                                required
                            />
                            {!isEditing && (
                                <>
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        value={newUser.password}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </>
                            )}
                            <label>Nombre</label>
                            <input type="text" name="name" placeholder="Nombre" value={newUser.name} onChange={handleFormChange} required />
                            <label>Apellido</label>
                            <input type="text" name="lastname" placeholder="Apellido" value={newUser.lastname} onChange={handleFormChange} required />
                            <label>Rol</label>
                            <input type="text" name="type" placeholder="Rol (A, E, C)" value={newUser.type} onChange={handleFormChange} required />
                            <label>Teléfono</label>
                            <input type="text" name="phonenumber" placeholder="Teléfono" value={newUser.phonenumber} onChange={handleFormChange} required />
                            <label>Correo</label>
                            <input type="email" name="email" placeholder="Correo" value={newUser.email} onChange={handleFormChange} required />
                            <label>Dirección</label>
                            <input type="text" name="address" placeholder="Dirección" value={newUser.address} onChange={handleFormChange} required />
                            <div className="modal-buttons">
                                <button type="submit" className="submit-button">Guardar</button>
                                <button type="button" className="cancel-button" onClick={closeForm}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación para eliminar */}
            {userToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Confirmación</h2>
                        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                        <div className="modal-buttons">
                            <button className="submit-button" onClick={deleteUser}>Sí, eliminar</button>
                            <button className="cancel-button" onClick={() => setUserToDelete(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Alertas */}
            {alertMessage && (
                <div className="alert-overlay">
                    <div className="alert-content">
                        <p>{alertMessage}</p>
                        <button className="submit-button" onClick={() => setAlertMessage('')}>Aceptar</button>
                    </div>
                </div>
            )}

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
                    {filteredUsers.map(user => (
                        <tr key={user.login}>
                            <td>{user.login}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.type}</td>
                            <td>
                                <button onClick={() => openForm(user)}>Editar</button>
                                <button onClick={() => setUserToDelete(user.login)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonManagement;
