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
        const linkform = "https://api.jsonbin.io/v3/b/" + response.data.metadata.id
        pool.query('INSERT INTO forms (login, linkform) VALUES ($1, $2)', [login, linkform], (err, results) => {
            if (err) console.log({message: 'Error al registrar el usuario'});
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error haciendo la solicitud: ${error.response ? error.response.data : error.message}`);
    }
};

const getForm = async (req, res) => {
    const idform = req.params.idform;
  
    try {
        const { rows } = await pool.query('SELECT * FROM forms WHERE idform = $1', [idform]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        const link = rows[0].linkform;
  
        const response = await axios.get(link, {
            headers: {
                "X-Master-Key": JSON_KEY
            }
        });
  
        // Envía la respuesta JSON al cliente
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        // Envía una respuesta de error en caso de fallo
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