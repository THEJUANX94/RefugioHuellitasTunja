const bcrypt = require('bcryptjs');
const { pool } = require('../database')

const getUsers = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM "User"'); 
        res.json(response.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};


const getUserbyLogin = async (req, res) => {
    const login = req.params.login
    const response = await pool.query('SELECT * FROM "User" WHERE login = $1' , [login]);
    res.json(response.rows);
}

const createUser = async (req, res) => {
    const { login, name, lastname, type, phonenumber, email, address } = req.body;

    pool.query('SELECT * FROM login WHERE login = $1', [login], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (results.length = 0) return res.status(400).json({ message: 'Usuario ya existe' });
        pool.query('INSERT INTO "User" (login, name, lastname, type, phonenumber, email, address) VALUES ($1, $2, $3, $4, $5, $6, $7)', [login, name, lastname, type, phonenumber, email, address], (err, results) => {
                if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
                res.status(201).json({ message: 'Usuario creado exitosamente' });
            });
        
    });
};

const updateUser = async (req, res) => {
    const { password, name, lastname, type, phonenumber, email, address } = req.body;
    const { login } = req.params; // Obtenemos el login de los parámetros de la ruta

    if (!login) {
        return res.status(400).json({ message: 'El login es obligatorio' });
    }

    try {
        // Construimos la consulta y los parámetros dinámicamente
        let query = 'UPDATE "User" SET ';
        const params = [];
        let paramIndex = 1; // Inicializamos el índice del placeholder

        if (password) {
            query += `password = $${paramIndex}, `;
            params.push(bcrypt.hashSync(password, 10));
            paramIndex++;
        }
        if (name) {
            query += `name = $${paramIndex}, `;
            params.push(name);
            paramIndex++;
        }
        if (lastname) {
            query += `lastname = $${paramIndex}, `;
            params.push(lastname);
            paramIndex++;
        }
        if (type) {
            query += `type = $${paramIndex}, `;
            params.push(type);
            paramIndex++;
        }
        if (phonenumber) {
            query += `phonenumber = $${paramIndex}, `;
            params.push(phonenumber);
            paramIndex++;
        }
        if (email) {
            query += `email = $${paramIndex}, `;
            params.push(email);
            paramIndex++;
        }
        if (address) {
            query += `address = $${paramIndex}, `;
            params.push(address);
            paramIndex++;
        }

        // Eliminamos la última coma y agregamos la cláusula WHERE
        query = query.slice(0, -2) + ` WHERE login = $${paramIndex} RETURNING *`;
        params.push(login);

        // Ejecutamos la consulta
        const result = await pool.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente', user: result.rows[0] });
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const deleteUser = async (req, res) => {
    const { login } = req.params; // Asegúrate de que el parámetro 'login' es correcto

    if (!login) {
        return res.status(400).json({ message: 'El login es obligatorio' });
    }

    try {
        // Inicia una transacción
        await pool.query('BEGIN');

        // Eliminar de la tabla "User"
        const userQuery = 'DELETE FROM "User" WHERE login = $1';
        const userResult = await pool.query(userQuery, [login]);

        if (userResult.rowCount === 0) {
            // Si no se encuentra en la tabla "User", hacemos rollback y devolvemos 404
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Usuario no encontrado en la tabla "User"' });
        }

        // Eliminar de la tabla "login"
        const loginQuery = 'DELETE FROM "login" WHERE login = $1';
        const loginResult = await pool.query(loginQuery, [login]);

        if (loginResult.rowCount === 0) {
            // Si no se encuentra en la tabla "login", hacemos rollback y devolvemos 404
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Usuario no encontrado en la tabla "login"' });
        }

        // Si ambas eliminaciones son exitosas, confirmamos la transacción
        await pool.query('COMMIT');

        res.status(200).json({ message: 'Usuario eliminado exitosamente de ambas tablas' });
    } catch (err) {
        // Si ocurre un error, hacemos rollback para revertir cambios
        await pool.query('ROLLBACK');
        console.error('Error al eliminar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { deleteUser };


module.exports = {
    getUsers,
    createUser,
    getUserbyLogin,
    deleteUser, 
    updateUser
}
