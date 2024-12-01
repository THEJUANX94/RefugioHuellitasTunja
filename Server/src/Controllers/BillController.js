const { pool } = require('../database')

const getBill = async (req, res) => {
    const response = await pool.query('SELECT * FROM bill');
    res.status(200).json(response.rows);
};

const getBillByID = async (req, res) => {
    const idbill = req.params.idbill
    const response = await pool.query('SELECT * FROM bill WHERE idbill = $1' , [idbill]);
    res.json(response.rows);
}

const createBill = async (req, res) => {
    const { client, payment_method, total_amount } = req.body;

    // Obtener la fecha en la zona horaria de Colombia (UTC -5)
    const colombiaOffset = -5 * 60; // Offset para Colombia (UTC -5 en minutos)
    const localDate = new Date();
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    const colombiaDate = new Date(utcDate.getTime() + colombiaOffset * 60000);

    // Convertir la fecha a formato compatible con PostgreSQL
    const billDate = colombiaDate.toISOString().slice(0, 19).replace('T', ' ');

    try {
        const response = await pool.query(
            'INSERT INTO bill (date, client, payment_method, total_amount) VALUES($1, $2, $3, $4) RETURNING idbill', 
            [billDate, client, payment_method, total_amount]
        );

        const newBillId = response.rows[0].idbill; // Obtenemos el idbill de la factura recién creada
        res.json({
            body: {
                bill: {
                    idbill: newBillId,
                    date: billDate,
                    client,
                    payment_method,
                    total_amount
                }
            }
        });
    } catch (error) {
        console.error('Error creating bill:', error);
        res.status(500).json({
            message: 'Error al crear la factura',
            error: error.message
        });
    }
};

const deleteBill = async (req, res) => {
    const idbill = req.params.idbill
    const response = await pool.query('DELETE FROM bill WHERE idbill = $1', [idbill])
    console.log(response);
    res.json('bill ${idbill} deleted')
}

module.exports = {
    getBill,
    createBill,
    getBillByID,
    deleteBill
}

