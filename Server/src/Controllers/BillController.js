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
    const { date, client, payment_method, total_amount} = req.body;
    const response = await pool.query('INSERT INTO bill (date, client, payment_method, total_amount) VALUES($1, $2, $3, $4, $5)', [date, client, payment_method, total_amount]);
    console.log(response);
    res.json({
        message: 'Factura añadida correctamente',
        body: {
            bill: {date, client, payment_method, total_amount}
        }
    })
}

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

