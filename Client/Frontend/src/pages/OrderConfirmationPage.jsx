import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCheckCircle } from "react-icons/fa"; // Usamos un icono de checkmark
import './css/style_order_confirmation.css'; // Estilos para la página

const OrderConfirmationPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Redirige al inicio
    };

    const handleGoToStore = () => {
        navigate('/store'); // Redirige a la tienda
    };

    return (
        <>
            <Header />
            <div className="order-confirmation-container">
                <img
                    src="https://www.trnd.com/es/proyectos/salud-canina/blog/muchas-gracias/bp-muchasgracias_full.jpg"
                    alt="Gracias por tu compra"
                    className="thank-you-img"
                />
                <FaCheckCircle className="checkmark-icon" />
                <h2>¡Compra realizada con éxito!</h2>
                <p>Gracias por tu compra. Tu pedido está siendo procesado.</p>
                <div className="confirmation-buttons">
                    <button onClick={handleGoHome}>Volver al Inicio</button>
                    <button onClick={handleGoToStore}>Seguir Comprando</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderConfirmationPage;
