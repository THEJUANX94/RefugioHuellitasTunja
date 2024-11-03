// backend/controllers/userController.js
const bcrypt = require('bcryptjs');
const { pool } = require('../database')

const getUsers = async (req, res) => {
    pool.query('SELECT * FROM "User"', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        res.status(200).json(results.rows);
    });
};

const getUserbyLogin = async (req, res) => {
    const login = req.params.login
    const response = await pool.query('SELECT * FROM "User" WHERE login = $1' , [login]);
    res.json(response.rows);
}

const createUser = async (req, res) => {
    const { login, password, name, lastname, type, phonenumber, email, address } = req.body;

    pool.query('SELECT * FROM login WHERE login = ?', [login], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (results.length = 0) return res.status(400).json({ message: 'Usuario ya existe' });

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error al hashear la contraseña' });

            pool.query('INSERT INTO login (login, password) VALUES (?, ?)', [login, hash], (err, results) => {
                if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
                res.status(201).json({ message: 'Usuario creado exitosamente' });
            });
            pool.query('INSERT INTO "User" (login, name, lastname, type, phonenumber, email, address) VALUES (?, ?)', [login, name, lastname, type, phonenumber, email, address], (err, results) => {
                if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
                res.status(201).json({ message: 'Usuario creado exitosamente' });
            });
        });
    });
};



const updateUser = async (req, res) => {
    const { password } = req.body;
    const login = req.params.login;

    if (password) {
        query += 'UPDATE login SET password = ?';
        params.push(bcrypt.hashSync(password, 10)); // Hashear la nueva contraseña
    }
    query += ' WHERE login = ?';
    params.push(login);

    pool.query(query, params, (err) => {
        if (err) return res.status(500).json({ message: 'Error al actualizar el usuario' });
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    });
};

const deleteUser = async (req, res) => {
    const login = req.params.login;

    pool.query('DELETE FROM "User" WHERE login = ?', [login], (err) => {
        if (err) return res.status(500).json({ message: 'Error al eliminar el usuario' });
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    });
    pool.query('DELETE FROM login WHERE login = ?', [login], (err) => {
        if (err) return res.status(500).json({ message: 'Error al eliminar el usuario' });
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    });
};

module.exports = {
    getUsers,
    createUser,
    getUserbyLogin,
    deleteUser, 
    updateUser
}
