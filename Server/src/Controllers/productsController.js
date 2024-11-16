const { pool } = require('../database')

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

module.exports = {
    getProducts,
    createProduct,
    getProductByidproduct,
    deleteProduct, 
    updateProduct
}

