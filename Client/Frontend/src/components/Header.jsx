import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './css/style_header.css';
import logo from './img/Logo.png'

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

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
    };

    return (
        <header className="header">
            <div className="logo">
                <a href="/"><img src={logo} alt="Refugio Huellitas Tunja" /></a>
            </div>
            <nav className="nav">
                <a href="/">Inicio</a>
                <a href="/about">Sobre Nosotros</a>
                <a href="/adopt">Adopta</a>
                <a href="/store">Tienda</a>
                <a href="/donate">Dona</a>
                {isAuthenticated ? (
                    <div className="user-info" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <FaUserCircle size={24} />
                        <span>{username}</span>
                    </div>
                ) : (
                    <a href="/login">Iniciar Sesión</a>
                )}
            </nav>
        </header>
    );
};

export default Header;
