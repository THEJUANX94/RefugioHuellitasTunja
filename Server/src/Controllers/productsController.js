const { pool } = require('../database')
const { v4: isUuid } = require('uuid');

const getProducts = async (req, res) => {
    const response = await pool.query('SELECT * FROM products');
    res.status(200).json(response.rows);
};

const getProductByidproduct = async (req, res) => {
    const idproduct = req.params.idproduct
    const response = await pool.query('SELECT * FROM products WHERE idproduct = $1' , [idproduct]);
    res.json(response.rows);
}

const createProduct = async (req, res) => {
    const { name, unitmeasure } = req.body;
    const response = await pool.query('INSERT INTO producto (name, unitmeasure) VALUES($1, $2)', [name, unitmeasure]);
    console.log(response);
    res.json({
        message: 'producto añadido correctamente',
        body: {
            producto: {name, unitmeasure}
        }
    })
}

const deleteProduct = async (req, res) => {
    const idproduct = req.params.idproduct
    const response = await pool.query('DELETE FROM products WHERE idproduct = $1', [idproduct])
    console.log(response);
    res.json('producto ${idproduct} borrado')
}

const updateProduct = async (req, res) => {
    const idproduct = req.params.idproduct
    const {name, unitmeasure} = req.body
    const response = await pool.query('UPDATE lote SET name = $1, unitmeasure = $2 WHERE idproduct = $3', [
        name, unitmeasure, idproduct
    ])
    console.log(response);
    res.send('Producto actualizado')
}

const inventoryPerProduct = async (req, res) => {
    const idproduct = req.params.idproduct
    console.log(idproduct);
    const response = await pool.query(`SELECT 
    p.idproduct,
    p.name,
    COALESCE(SUM(pl.quantity), 0) AS total_ingresos,
    COALESCE(SUM(bd.quantity), 0) AS total_salidas,
    COALESCE(SUM(pl.quantity), 0) - COALESCE(SUM(bd.quantity), 0) AS inventario_actual
FROM 
    products p
LEFT JOIN 
    products_lot pl ON p.idproduct = pl.idproduct
LEFT JOIN 
    bill_detail bd ON p.idproduct = bd.idproduct
WHERE
	p.idproduct = $1
GROUP BY 
    p.idproduct, p.name
ORDER BY 
    p.idproduct;`, [idproduct])
    res.status(200).json(response.rows);
}

module.exports = {
    getProducts,
    createProduct,
    getProductByidproduct,
    deleteProduct, 
    updateProduct,
    inventoryPerProduct 
}

