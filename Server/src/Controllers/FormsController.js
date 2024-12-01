const { JSON_KEY } = require('../config')
const axios = require('axios');
const { pool } = require('../database');

const uploadForm = async (data, login) => {
    try {
        const response = await axios.post('https://api.jsonbin.io/v3/b', data, {
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSON_KEY
            }
        });

        const linkform = "https://api.jsonbin.io/v3/b/" + response.data.metadata.id;

        // Convertir pool.query a una promesa y devolver idform
        const result = await new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO forms (login, linkform) VALUES ($1, $2) RETURNING idform',
                [login, linkform],
                (err, results) => {
                    if (err) {
                        console.error("Error al registrar el formulario en la base de datos:", err);
                        return reject(err);
                    }
                    resolve(results.rows[0]); // Devolver el idform
                }
            );
        });

        return { idform: result.idform, jsonBinResponse: response.data }; // Retornar idform y datos de JSONBin
    } catch (error) {
        console.error("Error en uploadForm:", error.message);
        throw new Error(`Error haciendo la solicitud: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
};

const getForm = async (req, res) => {
    const idform = req.params.idform;

    try {
        const { rows } = await pool.query('SELECT login, linkform FROM forms WHERE idform = $1', [idform]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const { login, linkform } = rows[0];

        const response = await axios.get(linkform, {
            headers: {
                "X-Master-Key": JSON_KEY
            }
        });

        return res.status(200).json({
            login: login,
            formData: response.data 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error haciendo la solicitud',
            details: error.response ? error.response.data : error.message
        });
    }
};

module.exports = {
    uploadForm,
    getForm
}