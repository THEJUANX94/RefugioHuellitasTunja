const { pool } = require('../database')

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




module.exports = {
    createPet,
    getPets,
    getPetsById,
    updatePet,
    deletePet
}