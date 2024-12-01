const { pool } = require('../database');

// Crear una adopción
const createAdoption = async (req, res) => {
    const { idpet , idform, state, collectionDate } = req.body;

    if (!idpet  || !idform || !state || !collectionDate) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        const query = `
            INSERT INTO Adoptions (idpet, idform, state, collectionDate)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [idpet , idform, state, collectionDate];
        const { rows } = await pool.query(query, values);

        res.status(201).json({ message: "Adopción creada con éxito.", adoption: rows[0] });
    } catch (error) {
        console.error("Error creando adopción:", error);
        res.status(500).json({ message: "Error al crear la adopción.", details: error.message });
    }
};

// Obtener todas las adopciones
const getAdoptions = async (req, res) => {
    try {
        const query = `
            SELECT a.idpet, a.idform, a.state, a.collectionDate, 
                   p.name AS pet_name, f.login AS form_login
            FROM Adoptions a
            JOIN Pets p ON a.idpet = p.idpet
            JOIN Forms f ON a.idform = f.idform;
        `;
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error obteniendo adopciones:", error);
        res.status(500).json({ message: "Error al obtener las adopciones.", details: error.message });
    }
};

// Obtener una adopción por idpet e idform
const getAdoptionById = async (req, res) => {
    const { idpet, idform } = req.params;

    try {
        const query = `
            SELECT a.idpet, a.idform, a.state, a.collectionDate, 
                   p.name AS pet_name, f.login AS form_login
            FROM Adoptions a
            JOIN Pets p ON a.idpet = p.idpet
            JOIN Forms f ON a.idform = f.idform
            WHERE a.idpet = $1 AND a.idform = $2;
        `;
        const { rows } = await pool.query(query, [idpet, idform]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Adopción no encontrada." });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error obteniendo adopción:", error);
        res.status(500).json({ message: "Error al obtener la adopción.", details: error.message });
    }
};

// Actualizar una adopción
const updateAdoption = async (req, res) => {
    const { idpet, idform } = req.params;
    const { state } = req.body;

    try {
        const query = `
            UPDATE Adoptions
            SET state = $1
            WHERE idpet = $2 AND idform = $3
            RETURNING *;
        `;
        const values = [state, idpet, idform];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Adopción no encontrada." });
        }

        res.status(200).json({ message: "Adopción actualizada con éxito.", adoption: rows[0] });
    } catch (error) {
        console.error("Error actualizando adopción:", error);
        res.status(500).json({ message: "Error al actualizar la adopción.", details: error.message });
    }
};

// Eliminar una adopción
const deleteAdoption = async (req, res) => {
    const { idpet, idform } = req.params;

    try {
        const query = `
            DELETE FROM Adoptions
            WHERE idpet = $1 AND idform = $2
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [idpet, idform]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Adopción no encontrada." });
        }

        res.status(200).json({ message: "Adopción eliminada con éxito.", adoption: rows[0] });
    } catch (error) {
        console.error("Error eliminando adopción:", error);
        res.status(500).json({ message: "Error al eliminar la adopción.", details: error.message });
    }
};

const updateOtherAdoptions = async (req, res) => {
    const { idpet, idform } = req.params;

    try {
        // Cambiar todas las adopciones de esta mascota a "denegado" excepto la seleccionada
        const query = `
            UPDATE Adoptions
            SET state = 'D'
            WHERE idpet = $1 AND idform != $2;
        `;
        const values = [idpet, idform];
        await pool.query(query, values);

        res.status(200).json({ message: "Otras solicitudes de adopción actualizadas a 'denegado'." });
    } catch (error) {
        console.error("Error actualizando otras adopciones:", error);
        res.status(500).json({ message: "Error al actualizar las otras adopciones.", details: error.message });
    }
};

module.exports = {
    createAdoption,
    getAdoptions,
    getAdoptionById,
    updateAdoption,
    deleteAdoption,
    updateOtherAdoptions,
};
