const { pool } = require('../database')

const getLot = async (req, res) => {
    const response = await pool.query('SELECT * FROM lot');
    res.status(200).json(response.rows);
};

const getLotByidlot = async (req, res) => {
    const idlot = req.params.idlot
    const response = await pool.query('SELECT * FROM lot WHERE idlot = $1' , [idlot]);
    res.json(response.rows);
}

const createLot = async (req, res) => {
    const { registerdate } = req.body;
    const response = await pool.query('INSERT INTO lot (registerdate) VALUES($1)', [registerdate]);
    console.log(response);
    res.json({
        message: 'Lote añadido correctamente',
        body: {
            lot: {registerdate}
        }
    })
}

const deleteLot = async (req, res) => {
    const idlot = req.params.idlot
    const response = await pool.query('DELETE FROM lot WHERE idlot = $1', [idlot])
    console.log(response);
    res.json('lot ${idlot} borrado')
}

const updateLot = async (req, res) => {
    const idlot = req.params.idlot
    const {registerdate} = req.body
    const response = await pool.query('UPDATE lote SET registerdate = $1 WHERE idlot = $2', [
        registerdate, idlot
    ])
    console.log(response);
    res.send('lote actualizado')
}

module.exports = {
    getLot,
    createLot,
    getLotByidlot,
    deleteLot, 
    updateLot
}

