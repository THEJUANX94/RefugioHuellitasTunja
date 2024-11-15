const { pool } = require('../database')
const { CLOUDINARY_URL } = require('../config');
const { uploadForm } = require('./FormsController');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dg639pvia',
    api_key: '488141991613393',
    api_secret: 'LfPK2HfMGfhRxH1TuqSl0tAHB4k'
});

const createPet = async (req, res) => {
    const { idspecies, name, birthday, race, details } = req.body;
    pool.query(`SELECT * FROM species WHERE idspecies = '${idspecies}'`, (err, result) => {
        if (err) return res.status(404).json({ message: 'Error, no se pudo encontrar la especie indicada.' })
        pool.query(`INSERT INTO pets (idspecies, name, birthday, race, details) VALUES ('${idspecies}', '${name}', 
        '${birthday}', '${race}', '${details}')`, (err, result) => {
        if (err) return res.status(409).json({ message: 'No se pudo crear la mascota.' })
        res.status(201).json({ message: "Mascota creada correctamente." })
        })
    });
}

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
      cb(null, 'uploads/'); // Temporary folder to store files before upload
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
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

module.exports = {
    createPet,
    getPets,
    getPetsById,
    updatePet,
    deletePet,
    uploadImages,
    newImage,
    searchImages
}