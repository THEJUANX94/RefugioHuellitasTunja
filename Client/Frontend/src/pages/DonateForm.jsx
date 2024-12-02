// src/pages/DonateForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import Header from "../components/Header";
import Footer from "../components/Footer";
import './css/style_donate_form.css';

const DonateForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [monto, setMonto] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const [donacionEnviada, setDonacionEnviada] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // 2. Inicializar navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donationData = {
      nombre,
      apellido,
      correo,
      monto,
      mensaje,
      tarjeta: {
        numeroTarjeta,
        fechaExpiracion,
        cvv,
      },
    };

    try {
      const response = await axios.post('http://localhost:4000/donate/create', donationData);
      console.log('Donación enviada:', response.data);
      setDonacionEnviada(true);
      setError(''); // Limpiar errores si el envío fue exitoso
    } catch (err) {
      console.error('Error al enviar la donación:', err);
      setError('Ocurrió un error al enviar la donación. Por favor, intenta nuevamente.');
    }
  };

  // 3. Crear el manejador para cancelar
  const handleCancel = () => {
    // Puedes navegar a la ruta que prefieras, por ejemplo, "/donate"
    navigate('/donate');
    // Si deseas navegar a la página anterior, usa:
    // navigate(-1);
  };

  return (
    <>
      <Header />
      <div className="donate-form-container">
        <h1 className="donate-form-title">Donaciones para el refugio de mascotas</h1>
        <p className="donate-form-description">Ayuda a nuestros amigos peludos a tener un hogar seguro y feliz.</p>
        <div className="donate-form-wrapper">
          <form className="donate-form" onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="nombre">Nombre:</label>
              <input
                className="donate-form-input"
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="apellido">Apellido:</label>
              <input
                className="donate-form-input"
                type="text"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="correo">Correo electrónico:</label>
              <input
                className="donate-form-input"
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="monto">Monto de la donación:</label>
              <input
                className="donate-form-input"
                type="number"
                id="monto"
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                required
                min="1"
                step="0.01"
              />
            </div>
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="mensaje">Mensaje:</label>
              <textarea
                className="donate-form-textarea"
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows="4"
              />
            </div>
            {/* Campos para la tarjeta */}
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="numeroTarjeta">Número de Tarjeta:</label>
              <input
                className="donate-form-input"
                type="text"
                id="numeroTarjeta"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value)}
                required
                maxLength="16"
                pattern="\d{16}"
                title="Por favor, ingresa un número de tarjeta válido de 16 dígitos."
              />
            </div>
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="fechaExpiracion">Fecha de Expiración:</label>
              <input
                className="donate-form-input"
                type="text"
                id="fechaExpiracion"
                placeholder="MM/AA"
                value={fechaExpiracion}
                onChange={(e) => setFechaExpiracion(e.target.value)}
                required
                pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})$"
                title="Por favor, ingresa una fecha válida en formato MM/AA."
              />
            </div>
            <div className="donate-form-group">
              <label className="donate-form-label" htmlFor="cvv">CVV:</label>
              <input
                className="donate-form-input"
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                maxLength="3"
                pattern="\d{3}"
                title="Por favor, ingresa un CVV válido de 3 dígitos."
              />
            </div>
            {/* 4. Agregar el botón de cancelar */}
            <div className="donate-form-buttons">
              <button
                className="donate-form-submit-button"
                type="submit"
              >
                Enviar donación
              </button>
              <button
                type="button"
                className="donate-form-cancel-button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        {donacionEnviada && (
          <div className="donate-form-success-message">
            <p>¡Muchas gracias por tu donación!</p>
          </div>
        )}
        {error && <p className="donate-form-error-message">{error}</p>}
      </div>
      <Footer />
    </>
  );
};

export default DonateForm;
