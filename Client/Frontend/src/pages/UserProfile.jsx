import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/style_user_profile.css';

const UserProfile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        login: '',
        name: '',
        lastname: '',
        type: '',
        phonenumber: '',
        email: '',
        address: '',
    });

    const [modal, setModal] = useState(null); // Controla qué modal se muestra
    const [editField, setEditField] = useState(''); // Campo que se está editando
    const [editValue, setEditValue] = useState(''); // Nuevo valor para el campo
    const [email, setEmail] = useState(''); // Para el cambio de contraseña
    const [code, setCode] = useState(''); // Código enviado al email
    const [newPassword, setNewPassword] = useState(''); // Nueva contraseña

    // Cargar datos del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const login = localStorage.getItem('username');
                if (!login) {
                    throw new Error('Usuario no autenticado');
                }

                const response = await fetch(`http://localhost:4000/users/${login}`);
                if (!response.ok) {
                    throw new Error(`Error al obtener los datos del usuario: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.length > 0) {
                    setUser(data[0]);
                } else {
                    console.error('No se encontró información del usuario.');
                }
            } catch (error) {
                console.error('Error al cargar los datos del usuario:', error.message);
            }
        };

        fetchUserData();
    }, []);

    const handleEditField = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/${user.login}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [editField]: editValue }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el campo');
            }

            setUser({ ...user, [editField]: editValue });
            setModal(null); // Cerrar modal
            alert('Campo actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el campo:', error.message);
            alert('Error al actualizar el campo');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        navigate('/'); // Redirige al inicio
    };

    const handleDeleteProfile = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/${user.login}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el perfil');
            }

            alert('Perfil eliminado con éxito');
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Error al eliminar el perfil:', error.message);
            alert('Error al eliminar el perfil');
        }
    };

    const handleSendCode = async () => {
        try {
            // Simular envío de código
            alert('Código enviado al correo electrónico');
        } catch (error) {
            console.error('Error al enviar código:', error.message);
        }
    };

    const handleChangePassword = async () => {
        try {
            // Simular cambio de contraseña
            alert('Contraseña cambiada exitosamente');
            setModal(null); // Cerrar modal
        } catch (error) {
            console.error('Error al cambiar contraseña:', error.message);
        }
    };

    // Renderizar modal según el flujo
    const renderModal = () => {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    {modal === 'logout' && (
                        <>
                            <h2>¿Quieres cerrar la sesión?</h2>
                            <p>Si cierras sesión, deberás ingresar tus credenciales para volver a acceder.</p>
                            <div className="form-buttons">
                                <button className="cancel-button" onClick={() => setModal(null)}>Cancelar</button>
                                <button className="submit-button" onClick={handleLogout}>Cerrar Sesión</button>
                            </div>
                        </>
                    )}
                    {modal === 'edit' && (
                        <>
                            <h2>Editar {editField}</h2>
                            <input
                                type="text"
                                placeholder={`Nuevo ${editField}`}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                            />
                            <div className="form-buttons">
                                <button className="cancel-button" onClick={() => setModal(null)}>Cancelar</button>
                                <button className="submit-button" onClick={handleEditField}>Guardar</button>
                            </div>
                        </>
                    )}
                    {modal === 'delete' && (
                        <>
                            <h2>Eliminar Perfil</h2>
                            <p>¿Estás seguro de que deseas eliminar tu cuenta?</p>
                            <div className="form-buttons">
                                <button className="cancel-button" onClick={() => setModal(null)}>Cancelar</button>
                                <button className="submit-button" onClick={handleDeleteProfile}>Eliminar</button>
                            </div>
                        </>
                    )}
                    {modal === 'change-password' && (
                        <>
                            <h2>Cambiar Contraseña</h2>
                            <input
                                type="text"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="submit-button" onClick={handleSendCode}>Enviar Código</button>
                            <input
                                type="text"
                                placeholder="Código recibido"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Nueva Contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <div className="form-buttons">
                                <button className="cancel-button" onClick={() => setModal(null)}>Cancelar</button>
                                <button className="submit-button" onClick={handleChangePassword}>Cambiar Contraseña</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="user-profile-container">
                <h2>Cuenta de Usuario</h2>
                <div className="user-profile-grid">
                    <div className="user-profile-left">
                        <div className="user-avatar-card bordered">
                            <span className="user-avatar">👤</span>
                            <h3>¡Hola, {user.name || 'Usuario'}!</h3>
                            <p>Gracias por ser parte de nuestra comunidad.</p>
                            <p>📞 {user.phonenumber || 'N/A'}</p>
                            <p>{user.email || 'N/A'}</p>
                            <div className="user-actions">
                                <button className="full-width" onClick={() => setModal('change-password')}>🔒 Cambiar Contraseña</button>
                                <button className="full-width" onClick={() => setModal('logout')}>🚪 Cerrar Sesión</button>
                                <button className="full-width" onClick={() => setModal('delete')}>🗑️ Eliminar Perfil</button>
                            </div>
                        </div>
                    </div>

                    <div className="user-profile-right bordered">
                        <div className="detail-card bordered">
                            <p><strong>📧 Email:</strong> {user.email || 'N/A'}</p>
                            <button onClick={() => { setEditField('email'); setEditValue(user.email); setModal('edit'); }}>Editar</button>
                        </div>
                        <div className="detail-card bordered">
                            <p><strong>📝 Nombre Completo:</strong> {`${user.name} ${user.lastname}` || 'N/A'}</p>
                            <button onClick={() => { setEditField('name'); setEditValue(user.name); setModal('edit'); }}>Editar</button>
                        </div>
                        <div className="detail-card bordered">
                            <p><strong>📍 Dirección:</strong> {user.address || 'N/A'}</p>
                            <button onClick={() => { setEditField('address'); setEditValue(user.address); setModal('edit'); }}>Editar</button>
                        </div>
                        <div className="detail-card bordered">
                            <p><strong>📞 Número de Teléfono:</strong> {user.phonenumber || 'N/A'}</p>
                            <button onClick={() => { setEditField('phonenumber'); setEditValue(user.phonenumber); setModal('edit'); }}>Editar</button>
                        </div>
                    </div>
                </div>
                {modal && renderModal()}
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;
