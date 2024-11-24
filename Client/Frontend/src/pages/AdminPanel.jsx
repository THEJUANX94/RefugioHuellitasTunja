import React, { useState } from 'react';
import Dashboard from '../components/dashboard';
import PersonManagement from '../components/PersonManagement';
import AnimalManagement from '../components/AnimalManagement';
import './css/style_adminpanel.css';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'personManagement':
                return <PersonManagement />;
            case 'animalManagement':
                return <AnimalManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="admin-panel">
            <aside className="sidebar">
                <button onClick={() => setActiveSection('dashboard')}>Dashboard</button>
                <button onClick={() => setActiveSection('personManagement')}>Gestionar Personas</button>
                <button onClick={() => setActiveSection('animalManagement')}>Gestionar Animales</button>
            </aside>
            <main className="content">{renderSection()}</main>
        </div>
    );
};

export default AdminPanel;
