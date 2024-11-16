const { pool } = require('../database')

const getProducts_lot = async (req, res) => {
    const response = await pool.query('SELECT * FROM products_lot');
    res.status(200).json(response.rows);
};

const getProducts_lotbyproduct = async (req, res) => {
    const idproduct = req.params.idproduct
    const response = await pool.query('SELECT * FROM products_lot WHERE idproduct = $1' , [idproduct]);
    res.json(response.rows);
}

const getProducts_lotbylot = async (req, res) => {
    const idlot = req.params.idlot
    const response = await pool.query('SELECT * FROM products_lot WHERE idlot = $1' , [idlot]);
    res.json(response.rows);
}

const createProducts_lot = async (req, res) => {
    const { idlot, idproduct, quantity, expiredate} = req.body;
    const response = await pool.query('INSERT INTO products_lot (idlot, idproduct, quantity, expiredate) VALUES($1, $2, $3, $4)', [idlot, idproduct, quantity, expiredate]);
    console.log(response);
    res.json({
        message: 'producto por lote añadido correctamente',
        body: {
            producto_lote: {idlot, idproduct, quantity, expiredate}
        }
    })
}

const deleteProducts_lot = async (req, res) => {
    const idproduct = req.params.idproduct
    const idlot = req.params.idlot
    const response = await pool.query('DELETE FROM products_lot WHERE (idproduct = $1 and idlot = $2)', [idproduct, idlot])
    console.log(response);
    res.json('producto por lote borrado correctamente')
}

const updateProducts_lot = async (req, res) => {
    const idproduct = req.params.idproduct
    const idlot = req.params.idlot
    const {quantity, expiredate} = req.body
    const response = await pool.query('UPDATE products_lot SET quantity = $1, expiredate = $2 WHERE (idproducto = $3 and idlote = $4)', [
        quantity, expiredate, idproduct, idlot
    ])
    console.log(response);
    res.send('producto por lote actualizado')
}

module.exports = {
    getProducts_lot,
    createProducts_lot,
    getProducts_lotbyproduct,
    getProducts_lotbylot,
    deleteProducts_lot, 
    updateProducts_lot
}

