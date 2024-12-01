import React, { useState } from 'react';
import Dashboard from '../components/dashboard';
import PersonManagement from '../components/PersonManagement';
import AnimalManagement from '../components/AnimalManagement';
import AdoptionManagement from '../components/AdoptionManagement';
import ProductManagement from '../components/ProductManagement';
import LotManagement from '../components/LotManagement'; // Nuevo componente
import InvoiceManagement from '../components/InvoiceManagement'; // Nuevo componente
import InventoryManagement from '../components/InventoryManagement'; // Nuevo componente
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
            case 'adoptionManagement':
                return <AdoptionManagement />;
            case 'productManagement':
                return <ProductManagement />;
            case 'lotManagement': // Nueva sección
                return <LotManagement />;
            case 'invoiceManagement': // Nueva sección
                return <InvoiceManagement />;
            case 'inventoryManagement': // Nueva sección
                return <InventoryManagement />;

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
                <button onClick={() => setActiveSection('adoptionManagement')}>Gestionar Adopciones</button>
                <button onClick={() => setActiveSection('productManagement')}>Gestionar Productos</button>
                <button onClick={() => setActiveSection('lotManagement')}>Gestionar Lotes</button> {/* Nuevo botón */}
                <button onClick={() => setActiveSection('invoiceManagement')}>Ver Facturas</button> {/* Nuevo botón */}
                <button onClick={() => setActiveSection('inventoryManagement')}>Ver Inventari</button> {/* Nuevo botón */}
            </aside>
            <main className="content">{renderSection()}</main>
        </div>
    );
};

export default AdminPanel;
