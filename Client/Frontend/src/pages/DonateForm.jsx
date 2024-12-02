import React, { useState } from 'react';
import axios from 'axios';
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

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6 md:p-6 lg:p-12 bg-white rounded shadow-md">
      <Header />
      <h1 className="text-3xl text-gray-900 font-bold mb-4">Donaciones para el refugio de mascotas</h1>
      <p className="text-lg text-gray-600 mb-6">Ayuda a nuestros amigos peludos a tener un hogar seguro y feliz.</p>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="nombre">Nombre:</label>
            <input
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="apellido">Apellido:</label>
            <input
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              type="text"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="correo">Correo electrónico:</label>
            <input
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="monto">Monto de la donación:</label>
            <input
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              type="number"
              id="monto"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="mensaje">Mensaje:</label>
            <textarea
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>
          {/* Campos para la tarjeta */}
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="numeroTarjeta">Número de Tarjeta:</label>
            <input
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              type="text"
              id="numeroTarjeta"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="fechaExpiracion">Fecha de Expiración:</label>
            <input
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              type="text"
              id="fechaExpiracion"
              placeholder="MM/AA"
              value={fechaExpiracion}
              onChange={(e) => setFechaExpiracion(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg text-gray-600 mb-2" htmlFor="cvv">CVV:</label>
            <input
              className="p-2 pl-10 text-lg text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </div>
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-orange-400"
            type="submit"
          >
            Enviar donación
          </button>
        </form>
      </div>
      {donacionEnviada && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
          <p>¡Muchas gracias por tu donación!</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Footer />
    </div>
  );
};

export default DonateForm;
