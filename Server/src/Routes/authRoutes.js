// backend/routes/authRoutes.js
const express = require('express');
const { login, logout, register, authMiddleware } = require('../Controllers/authController.js');
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/admin', authMiddleware, (req, res) => {
    if (req.cookies.session.roleId === 1) { // Administrador
        res.send('Contenido para administradores');
    } else {
        res.status(403).json({ message: 'Acceso denegado' });
    }
});

module.exports = router;
