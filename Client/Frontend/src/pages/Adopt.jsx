import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/style_adopt.css';


const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (e) => {

    };

    return (
        <>
            <Header />
            <div className='background'>
                <div className='title'>
                    <h1>¿Estás buscando un nuevo amigo?</h1>
                    <p>Todos ellos están listos para su adopción</p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
