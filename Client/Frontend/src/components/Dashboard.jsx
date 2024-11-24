import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:4000/stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1>Estadísticas del Sistema</h1>
            <p>Usuarios Totales: {stats.totalUsers || 'Cargando...'}</p>
            <p>Animales Registrados: {stats.totalPets || 'Cargando...'}</p>
        </div>
    );
};

export default Dashboard;
