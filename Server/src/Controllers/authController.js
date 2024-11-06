// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../database')

const login = async (req, res) => {
    const { login, password } = req.body;

    pool.query('SELECT * FROM login WHERE login = $1', [login], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidorr' });
        if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        //Valida la contraseña ingresada
        bcrypt.compare(password, results.rows[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor' });
            if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

            pool.query('SELECT * FROM "User" WHERE login = $1', [login], (err, results) => {
                if (err) return console.error('Error querying database:', err);
                if (results.rows[0].type === 'A') {
                    const token = jwt.sign({ userId: 1, role: 'admin' }, 'secretKey', { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    res.cookie('session', { roleId: 1 }, { httpOnly: true });
                    res.json({ message: 'Autenticado correctamente' });
                }
            });
            
        });
    });
};

const logout = async (req, res) => {
    res.clearCookie('access_token')
    .json({message: 'logout successful'})
};

const register = async (req, res) => {
    const { login, password } = req.body;

    // Verificar si el usuario ya existe
    pool.query('SELECT * FROM login WHERE login = $1;', [login], (err, results) => {
        if (err) return console.error('Error querying database:', err);
        if (results.length > 0) return res.status(400).json({ message: 'Usuario ya existe' });

        // Hashear la contraseña
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error al hashear la contraseña' });
            if(typeof login != 'string') throw new Error ('username must be a string')
            if(login.length < 3) throw new Error ('username must be at least 3 characters long')

            // Insertar el nuevo usuario en la base de datos
            pool.query('INSERT INTO login (login, password) VALUES ($1, $2)', [login, hash], (err, results) => {
                if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    });
};

function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No autorizado' });

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = decoded;
        next();   

    });
}

module.exports = {
    login,
    logout,
    register,
    authMiddleware
}
