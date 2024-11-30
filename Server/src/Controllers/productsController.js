const { pool } = require('../database')
const { v4: isUuid } = require('uuid');
const { CLOUDINARY_URL } = require('../config');
const { uploadForm } = require('./FormsController');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dg639pvia',
    api_key: '488141991613393',
    api_secret: 'LfPK2HfMGfhRxH1TuqSl0tAHB4k'
});

const getProducts = async (req, res) => {
    const response = await pool.query('SELECT * FROM products');
    res.status(200).json(response.rows);
};

const getProductByidproduct = async (req, res) => {
    const idproduct = req.params.idproduct
    const response = await pool.query('SELECT * FROM products WHERE idproduct = $1' , [idproduct]);
    res.json(response.rows);
}

const getProductByidCategory = async (req, res) => {
    const idproduct = req.params.category_id
    const response = await pool.query('SELECT * FROM products WHERE category_id = $1' , [category_id]);
    res.json(response.rows);
}

const createProduct = async (req, res) => {
    const { name, unitmeasure, description, category_id, price } = req.body;
    const response = await pool.query('INSERT INTO producto (name, unitmeasure, description, category_id, price) VALUES($1, $2, $3, $4, $5)', [name, unitmeasure, description, category_id, price]);
    console.log(response);
    res.json({
        message: 'producto añadido correctamente',
        body: {
            producto: {name, unitmeasure, description, category_id, price}
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
    const {name, unitmeasure, description, category_id, price} = req.body
    const response = await pool.query('UPDATE lote SET name = $1, unitmeasure = $2, description = $3, category_id = $4, price = $5 WHERE idproduct = $6', [
        name, unitmeasure, description, category_id, price, idproduct
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Temporary folder to store files before upload
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
  });
  
const uploadImages = multer({ storage });

const newImage = async (req, res, link) => {
    const idproduct = req.params.idproduct;
    pool.query(`INSERT INTO ProductImages (idproduct, linkimage) VALUES ('${idproduct}', '${link}')`)
};

const searchImages = async(req, res) => {
    const idproduct = req.params.idproduct;
    pool.query(`SELECT linkimage FROM ProductImages WHERE idproduct = '${idproduct}'`, (err, results) => {
        if (err) return res.status(404).json({ message: 'Error, no se pudo encontrar el producto indicado.' });
        res.status(200).json(results.rows);
    });
}

module.exports = {
    getProducts,
    createProduct,
    getProductByidproduct,
    deleteProduct, 
    updateProduct,
    inventoryPerProduct,
    newImage,
    searchImages,
    uploadImages,
    getProductByidCategory
}

