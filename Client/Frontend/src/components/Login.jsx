import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = { login, password };

    try {
      const response = await fetch(' http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Login exitoso');
        navigate('/home');
      } else {
        setMensaje(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div className="form-container">
      <h3>Iniciar Sesión</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Login:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {mensaje && <p className="feedback-message">{mensaje}</p>}
    </div>
  );
};

export default Login;
