// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../database')
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const login = async (req, res) => {
    const { login, password } = req.body;

    pool.query('SELECT * FROM login WHERE login = $1', [login], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (results.rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        bcrypt.compare(password, results.rows[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor' });
            if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

            pool.query('SELECT * FROM "User" WHERE login = $1', [login], (err, userResults) => {
                if (err) return console.error('Error querying database:', err);

                const username = userResults.rows[0].login;
                if (userResults.rows[0].type === 'A') {
                    const token = jwt.sign({ userId: 1, role: 'admin' }, 'secretKey', { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    res.cookie('session', { roleId: 1 }, { httpOnly: true });
                    res.json({ message: 'Autenticado correctamente', username });
                }
                else if (userResults.rows[0].type === 'C') {
                    const token = jwt.sign({ userId: 2, role: 'Client' }, 'secretKey', { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    res.cookie('session', { roleId: 2 }, { httpOnly: true });
                    res.json({ message: 'Autenticado correctamente', username });
                }
                else if (userResults.rows[0].type === 'E') {
                    const token = jwt.sign({ userId: 3, role: 'Employee' }, 'secretKey', { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    res.cookie('session', { roleId: 3 }, { httpOnly: true });
                    res.json({ message: 'Autenticado correctamente', username });
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

// Función para generar un token de restablecimiento
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Función para guardar el token de restablecimiento
const saveResetToken = async (login, resetToken) => {
  try {
    await pool.query('UPDATE login SET reset_token = $1, reset_token_expiration = $2 WHERE login = $3', [
      resetToken,
      Date.now() + 3600000, // 1 hora
      login
    ]);
  } catch (error) {
    console.error('Error al guardar el token de restablecimiento:', error);
  }
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sebastianmn03@gmail.com',
        pass: 'ydxk nrqz otti ovpo'
    }
});

const sendResetEmail = async (email, resetToken) => {
    const mailOptions = {
        from: 'HuellitasTunja <sebastianmn03@gmail.com>',
        to: email,
        subject: 'Restablecer contraseña',
        html: `
            <p>Hola,</p>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
            <a href="http://localhost:4000/reset-password/${resetToken}">Restablecer contraseña</a>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
};

// Función para verificar el token y actualizar la contraseña
const resetPassword = async (req, res) => {
    const reset_token = req.params.resetToken
    const { newPassword } = req.body;
  try {
    const result = await pool.query('SELECT * FROM login WHERE reset_token = $1 AND reset_token_expiration > $2', [
      reset_token,
      Date.now()
    ]);
    if (result.rows.length === 0) {
      throw new Error('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE login SET password = $1, reset_token = NULL, reset_token_expiration = NULL WHERE login = $2', [
      hashedPassword,
      result.rows[0].login
    ]);
    
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
  }
  res.status(200).json({ message: 'Cambio de contraseña correcto' });
};

const reset = async (req, res) => {
    const { login } = req.body;
  
    pool.query('SELECT * FROM "User" WHERE login = $1', [login], (err, results) => {
        const resetToken = generateResetToken();
        saveResetToken(login, resetToken);
        sendResetEmail(results.rows[0].email, resetToken)
        if(err) res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña' });
    }
  )};


module.exports = {
    login,
    logout,
    register,
    authMiddleware,
    generateResetToken,
    saveResetToken,
    resetPassword,
    sendResetEmail,
    reset
}
