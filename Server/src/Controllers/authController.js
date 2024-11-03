// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const { pool } = require('../database')

const login = async (req, res) => {
    const { login, password } = req.body;
    // Verificar si el usuario ya existe
    pool.query('SELECT * FROM "User" WHERE login = ?', [login], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        const user = results[0];
        //Valida la contraseña ingresada
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor' });
            if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

            req.session.user = user;
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        });
    });
};

const logout = async (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: 'Sesión cerrada' });
    });
};

const register = async (req, res) => {
    const { login, password } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM "Users" WHERE login = ?', [login], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (results.length > 0) return res.status(400).json({ message: 'Usuario ya existe' });

        // Hashear la contraseña
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error al hashear la contraseña' });

            // Insertar el nuevo usuario en la base de datos
            db.query('INSERT INTO "Users" (login, password) VALUES (?, ?)', [login, hash], (err, results) => {
                if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    });
};

module.exports = {
    login,
    logout,
    register
}
