const { pool } = require('../database');

// Obtener todas las donaciones
const getDonations = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM donaciones');
        res.status(200).json(response.rows);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({
            message: 'Error al obtener las donaciones',
            error: error.message
        });
    }
};

// Obtener una donación por ID
const getDonationByID = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await pool.query('SELECT * FROM donaciones WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({ message: 'Donación no encontrada' });
        }
        res.status(200).json(response.rows[0]);
    } catch (error) {
        console.error('Error fetching donation by ID:', error);
        res.status(500).json({
            message: 'Error al obtener la donación',
            error: error.message
        });
    }
};

const createDonation = async (req, res) => {
  const { nombre, apellido, correo, monto, mensaje, tarjeta } = req.body;

  // Obtener la fecha en la zona horaria de Colombia (UTC -5)
  const colombiaOffset = -5 * 60; // Offset para Colombia (UTC -5 en minutos)
  const localDate = new Date();
  const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
  const colombiaDate = new Date(utcDate.getTime() + colombiaOffset * 60000);

  // Convertir la fecha a formato compatible con PostgreSQL
  const donationDate = colombiaDate.toISOString().slice(0, 19).replace('T', ' ');

  try {
      // Insertar la donación en la tabla donaciones
      const donationResponse = await pool.query(
          'INSERT INTO donaciones (nombre, apellido, correo, monto, mensaje, fecha) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
          [nombre, apellido, correo, monto, mensaje, donationDate]
      );

      const newDonationId = donationResponse.rows[0].id;

      // Insertar los datos de la tarjeta en la tabla tarjetas
      if (tarjeta) {
          const { numeroTarjeta, fechaExpiracion, cvv } = tarjeta;
          await pool.query(
              'INSERT INTO tarjetas (numero_tarjeta, fecha_expiracion, cvv, donacion_id) VALUES ($1, $2, $3, $4)',
              [numeroTarjeta, fechaExpiracion, cvv, newDonationId]
          );
      }

      res.status(201).json({
          body: {
              donation: {
                  id: newDonationId,
                  nombre,
                  apellido,
                  correo,
                  monto,
                  mensaje,
                  fecha: donationDate,
              },
          },
      });
  } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({
          message: 'Error al crear la donación',
          error: error.message,
      });
  }
};

// Eliminar una donación por ID
const deleteDonation = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await pool.query('DELETE FROM donaciones WHERE id = $1', [id]);
        if (response.rowCount === 0) {
            return res.status(404).json({ message: 'Donación no encontrada' });
        }
        res.json({ message: `Donación con ID ${id} eliminada` });
    } catch (error) {
        console.error('Error deleting donation:', error);
        res.status(500).json({
            message: 'Error al eliminar la donación',
            error: error.message
        });
    }
};

module.exports = {
    getDonations,
    createDonation,
    getDonationByID,
    deleteDonation
};
