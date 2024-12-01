// Header.js
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa'; // Eliminamos FaBell
import './css/style_header.css';
import logo from './img/Logo2.png';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated') === 'true';
        const user = localStorage.getItem('username');
        setIsAuthenticated(auth);
        setUsername(user || '');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
        navigate('/'); // Redirige al inicio
    };

    const goToProfile = () => {
        navigate('/profile');
    };

    const goToCart = () => {
        navigate('/cart');
    };

    return (
        <header className="header">
            <div className="logo">
                <NavLink to="/"><img src={logo} alt="Refugio Huellitas Tunja" /></NavLink>
            </div>
            <nav className="nav">
                <div className="nav-item">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Inicio</NavLink>
                </div>
                <div className="nav-item">
                    <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>Sobre Nosotros</NavLink>
                </div>
                <div className="nav-item">
                    <NavLink to="/adopt" className={({ isActive }) => isActive ? 'active' : ''}>Adopta</NavLink>
                </div>
                <div className="nav-item">
                    <NavLink to="/store" className={({ isActive }) => isActive ? 'active' : ''}>Tienda</NavLink>
                </div>
                <div className="nav-item">
                    <NavLink to="/donate" className={({ isActive }) => isActive ? 'active' : ''}>Dona</NavLink>
                </div>
                <div className="icon-container">
                    <FaShoppingCart className="icon" onClick={goToCart} />
                    {isAuthenticated ? (
                        <div className="user-info" onClick={goToProfile} style={{ cursor: 'pointer' }}>
                            <FaUserCircle size={24} />
                            <span>{username}</span>
                        </div>
                    ) : (
                        <div className="buttom">
                            <NavLink to="/login" className="loginButton">Iniciar Sesión</NavLink>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
