import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/style_login.css';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ login, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful!");
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', data.username);

                // Verificar el rol del usuario
                if (data.type === 'A') {
                    navigate('/admin-panel'); // Redirigir a la página de admin si el rol es admin
                } else if (data.type === 'C') {
                    navigate('/'); // Redirigir al cliente a la página principal
                } else if (data.type === 'E') {
                    navigate('/admin-panel');
                }
            } else {
                setError(data.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            setError("Error en el inicio de sesión");
        }
    };

    return (
        <>
            <Header />
            <div className="login-container">
                <div className="login-box">
                    <h2>Bienvenido a <span className="highlight">Huellitas Tunja</span></h2>
                    <h3>Iniciar Sesión</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Ingrese su usuario</label>
                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="Usuario"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ingrese su contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <div className="links">
                        <a href="/forgot-password">¿Olvidó su contraseña?</a>
                        <p>¿No tiene cuenta? <a href="/register">Registrarse</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
