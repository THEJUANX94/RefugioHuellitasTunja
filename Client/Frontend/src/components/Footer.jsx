import React from 'react';
import './css/style_footer.css';
import Logo from './img/Logo2.png';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <img src={Logo} alt="Refugio Huellitas Tunja" className="footer-logo" />
                <p>Un hogar para aquellos que buscan una segunda oportunidad.</p>
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
                    <a href="https://Whatsapp.com" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                </div>
                <p> <strong>© Copyright Huellitas Tunja  2024.</strong> </p>
            </div>

            <div className="footer-section">
                <h3>Contacto</h3>
                <p>Dirección: Calle 123, Tunja</p>
                <p>Teléfono: +57 123 456 7890</p>
                <p>Email: info@huellitastunja.com</p>
            </div>

            <div className="footer-section">
                <h3>Enlaces</h3>
                <nav className="footer-nav">
                    <a href="/">Inicio</a>
                    <a href="/about">Sobre Nosotros</a>
                    <a href="/adopt">Adopta</a>
                    <a href="/store">Tienda</a>
                    <a href="/donate">Dona</a>
                    <a href="/login">Iniciar Sesión</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
