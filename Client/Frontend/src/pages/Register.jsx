import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/style_register.css';
import { FaArrowLeft } from 'react-icons/fa';

const Register = () => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        name: '',
        lastname: '',
        phonenumber: '',
        address: '',
        email: '',
        login: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const validateStepOne = () => {
        if (!userData.name.trim() || !userData.lastname.trim() || !userData.phonenumber.trim() || !userData.address.trim() || !userData.email.trim()) {
            setError("Por favor, complete todos los campos.");
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            setError("Por favor, ingrese un correo electrónico válido.");
            return false;
        }

        const phonePattern = /^[0-9]+$/;
        if (!phonePattern.test(userData.phonenumber)) {
            setError("El número de teléfono solo debe contener dígitos.");
            return false;
        }

        setError('');
        return true;
    };

    const handleNextStep = () => {
        if (validateStepOne()) {
            setStep(2);
        }
    };

    const handlePreviousStep = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            await fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: userData.login,
                    name: userData.name,
                    lastname: userData.lastname,
                    type: 'C',
                    phonenumber: userData.phonenumber,
                    email: userData.email,
                    address: userData.address,
                }),
            });

            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: userData.login,
                    password: userData.password,
                }),
            });

            if (response.ok) {
                alert('Registro exitoso');
                navigate('/login');
            } else {
                setError('Error al registrar el usuario');
            }
        } catch (err) {
            setError('Error en el servidor');
        }
    };

    return (
        <>
            <Header />
            <div className="register-container">
                <div className="register-box">
                    <h2>Bienvenido a <span className="highlight">Huellitas Tunja</span></h2>
                    <h3>Registrarse</h3>
                    {step === 1 ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                            <div className='colums'>
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Nombre" required />
                                </div>
                                <div className="form-group">
                                    <label>Apellido</label>
                                    <input type="text" name="lastname" value={userData.lastname} onChange={handleChange} placeholder="Apellido" required />
                                </div>
                            </div>
                            <div className='colums'>
                                <div className="form-group">
                                    <label>Teléfono</label>
                                    <input type="text" name="phonenumber" value={userData.phonenumber} onChange={handleChange} placeholder="Teléfono" required />
                                </div>
                                <div className="form-group">
                                    <label>Dirección</label>
                                    <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Dirección" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="E-mail" required />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="button" className="next-button" onClick={handleNextStep}>Siguiente</button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Usuario</label>
                                <input type="text" name="login" value={userData.login} onChange={handleChange} placeholder="Usuario" required />
                            </div>
                            <div className='colums'>
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Contraseña" required />
                                </div>
                                <div className="form-group">
                                    <label>Verifique su Contraseña</label>
                                    <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} placeholder="Confirma Contraseña" required />
                                </div>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <div className="button-row">
                                <button type="button" className="prev-button" onClick={handlePreviousStep}>
                                    <FaArrowLeft />
                                </button>
                                <button type="submit" className="register-button">Registrarse</button>
                            </div>
                        </form>
                    )}
                    <div className="links">
                        <p>¿Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
