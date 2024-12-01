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

    try {
        const response = await pool.query(
            'INSERT INTO lot (registerdate) VALUES($1) RETURNING idlot', 
            [registerdate]
        );

        const idlote = response.rows[0].idlot;

        res.json({
            message: 'Lote añadido correctamente',
            body: {
                lot: { idlote, registerdate },
            },
        });
    } catch (error) {
        console.error('Error al crear el lote:', error);
        res.status(500).json({ error: 'Error al crear el lote' });
    }
};

const deleteLot = async (req, res) => {
    const { idlote } = req.params;

    try {
        // Eliminar productos relacionados en products_lot
        await pool.query('DELETE FROM products_lot WHERE idlot = $1', [idlote]);

        // Eliminar el lote en lot
        await pool.query('DELETE FROM lot WHERE idlot = $1', [idlote]);

        console.log(`Lote ${idlote} y sus productos relacionados eliminados correctamente.`);
        res.json({ message: `Lote ${idlote} y sus productos relacionados eliminados correctamente.` });
    } catch (error) {
        console.error('Error al eliminar el lote y sus productos:', error);
        res.status(500).json({ error: 'Error al eliminar el lote y sus productos' });
    }
};
const updateLot = async (req, res) => {
    const idlot = req.params.idlot
    const {registerdate} = req.body
    const response = await pool.query('UPDATE lote SET registerdate = $1 WHERE idlot = $2', [
        registerdate, idlot
    ])
    console.log(response);
    res.send('lote actualizado')
}

const getLotsWithProducts = async (req, res) => {
    try {
        const response = await pool.query(`
            SELECT l.idlot, l.registerdate, 
                   json_agg(json_build_object(
                       'idproduct', pl.idproduct,
                       'quantity', pl.quantity,
                       'purchase_price', pl.purchase_price,
                       'expiredate', pl.expiredate,
                       'name', p.name,
                       'unitmeasure', p.unitmeasure,
                       'price', p.price
                   )) AS products
            FROM lot l
            LEFT JOIN products_lot pl ON l.idlot = pl.idlot
            LEFT JOIN products p ON pl.idproduct = p.idproduct
            GROUP BY l.idlot
        `);
        res.json(response.rows);
    } catch (error) {
        console.error('Error al obtener lotes con productos:', error);
        res.status(500).json({ error: 'Error al obtener lotes con productos' });
    }
};

module.exports = {
    getLot,
    createLot,
    getLotByidlot,
    deleteLot, 
    updateLot,
    getLotsWithProducts
}

