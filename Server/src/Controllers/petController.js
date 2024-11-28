const { pool } = require('../database')
const { CLOUDINARY_URL } = require('../config');
const { uploadForm } = require('./FormsController');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: 'dg639pvia',
    api_key: '488141991613393',
    api_secret: 'LfPK2HfMGfhRxH1TuqSl0tAHB4k'
});

const createPet = async (req, res) => {
    const { idspecies, name, birthday, race, details } = req.body;

    if (!idspecies || !name || !birthday || !race || !details) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    pool.query(`SELECT * FROM species WHERE idspecies = $1`, [idspecies], (err, result) => {
        if (err || result.rowCount === 0) {
            return res.status(404).json({ message: 'Error, no se pudo encontrar la especie indicada.' });
        }

        pool.query(
            `INSERT INTO pets (idspecies, name, birthday, race, details) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING idpet`,
            [idspecies, name, birthday, race, details],
            (err, result) => {
                if (err) {
                    console.error("Error inserting pet:", err);
                    return res.status(409).json({ message: 'No se pudo crear la mascota.' });
                }
                res.status(201).json({ message: "Mascota creada correctamente.", idPet: result.rows[0].idpet });
            }
        );
    });
};



const getPets = async (req, res) => {
    pool.query('SELECT * FROM Pets', (err, results) => {
        if (err) return res.status(404).json({ message: 'Error, no se pudieron encontrar mascotas.' });
        res.status(200).json(results.rows);
    });
};

const getPetsById = async (req, res) => {
    const idpet = req.params.idpet;
    pool.query(`SELECT FROM pets WHERE idpet = '${idpet}'`, (err, results) => {
        if (err) return res.status(404).json({ message: 'Error, no se pudo encontrar la mascota indicada.' });
        res.status(200).json(results.rows);
    });
};

const updatePet = async (req, res) => {
    const { name, birthday, race, details } = req.body;
    const idpet = req.params.idpet;
    pool.query(`SELECT FROM pets WHERE idpet = '${idpet}'`, (err) => {
        let fieldsToUpdate = [];
        if (err) return res.status(404).json({ message: 'Error, no se pudo encontrar la mascota indicada.' });
        if (name) fieldsToUpdate.push(`name = '${name}'`);
        if (birthday) fieldsToUpdate.push(`birthday = '${birthday}'`);
        if (race) fieldsToUpdate.push(`race = '${race}'`);
        if (details) fieldsToUpdate.push(`details = '${details}'`);
        const updateQuery = `UPDATE pets SET ${fieldsToUpdate.join(', ')} WHERE idpet = '${idpet}'`;
        pool.query(updateQuery, (err, result) => {
            if (err) return res.status(404).json({ message: 'Error no se pudo actualizar la mascota.' });
            res.status(200).json({ message: 'Mascota actualizada correctamente.' });
        });
    });
}

const deletePet = async (req, res) => {
    const idpet = req.params.idpet;
    pool.query(`DELETE FROM pets WHERE idpet = '${idpet}'`, (err) => {
        if (err) return res.status(404).json({ message: 'Error, no se pudo eliminar la mascota indicada.' })
        res.status(204).json({ message: "Mascota eliminada correctamente." })
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads'); // Ruta absoluta al directorio 'uploads'

        // Verificar si el directorio existe, si no, crearlo
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log(`Directory ${uploadDir} created successfully.`);
        }

        cb(null, uploadDir); // Usar el directorio para guardar los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único para el archivo
    }
});

const uploadImages = multer({ storage });

const newImage = async (req, res, link) => {
    const idpet = req.params.idpet;
    pool.query(`INSERT INTO images (idpet, linkimage) VALUES ('${idpet}', '${link}')`)
};

const searchImages = async(req, res) => {
    const idpet = req.params.idpet;
    pool.query(`SELECT linkimage FROM images WHERE idpet = '${idpet}'`, (err, results) => {
        if (err) return res.status(404).json({ message: 'Error, no se pudo encontrar la mascota indicada.' });
        res.status(200).json(results.rows);
    });
}

const getSpecies = async (req, res) => {
    pool.query('SELECT idspecies, name FROM Species', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching species.' });
        res.status(200).json(results.rows);
    });
};

const getRacesBySpecies = async (req, res) => {
    const { idspecies } = req.params;
    pool.query(
        'SELECT DISTINCT race FROM Pets WHERE idspecies = $1',
        [idspecies],
        (err, results) => {
            if (err) {
                console.error("Error fetching races by species:", err);
                return res.status(500).json({ message: 'Error fetching races.' });
            }
            res.status(200).json(results.rows);
        }
    );
};

module.exports = {
    createPet,
    getPets,
    getPetsById,
    updatePet,
    deletePet,
    getSpecies,
    getRacesBySpecies,
    uploadImages,
    newImage,
    searchImages
}