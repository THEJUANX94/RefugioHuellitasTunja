const { pool } = require('../database');
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
    try {
        const query = `
            SELECT 
                p.idproduct, 
                p.name, 
                p.unitmeasure, 
                p.quantity_per_unit, 
                p.description, 
                p.price, 
                p.category_id, 
                c.name AS category_name 
            FROM 
                products p
            LEFT JOIN 
                categories c ON p.category_id = c.idcategory;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products.' });
    }
};


const getProductByidproduct = async (req, res) => {
    const idproducto = req.params.idproducto;
    const response = await pool.query(`SELECT p.*, c.name AS category_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.idcategory
             WHERE p.idproduct = $1`, [idproducto]);
    res.json(response.rows);
};

const getProductByidCategory = async (req, res) => {
    const category_id = req.params.category_id;
    const response = await pool.query('SELECT * FROM products WHERE category_id = $1', [category_id]);
    res.json(response.rows);
};

const createProduct = async (req, res) => {
    const { name, unitmeasure, quantity_per_unit, description, category_id, price } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO products (name, unitmeasure, quantity_per_unit, description, category_id, price)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING idproduct`,
            [name, unitmeasure, quantity_per_unit, description, category_id, price]
        );

        const idproduct = result.rows[0].idproduct;

        res.status(201).json({ idproduct });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto.' });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Eliminar la imagen de la base de datos
        await pool.query(`DELETE FROM productimages WHERE idproduct = $1`, [id]);

        // Eliminar el producto
        const result = await pool.query(`DELETE FROM products WHERE idproduct = $1`, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
};

const updateProduct = async (req, res) => {
    const editId = req.params.editId ;
    const { name, unitmeasure, quantity_per_unit, description, category_id, price } = req.body;
    const response = await pool.query(
        'UPDATE products SET name = $1, unitmeasure = $2, quantity_per_unit = $3, description = $4, category_id = $5, price = $6 WHERE idproduct = $7',
        [name, unitmeasure, quantity_per_unit, description, category_id, price, editId]
    );
    res.send('Producto actualizado');
};

const inventoryPerProduct = async (req, res) => {
    const idproduct = req.params.idproduct;
    const response = await pool.query(
        `SELECT 
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
            p.idproduct;`,
        [idproduct]
    );
    res.status(200).json(response.rows);
};

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
    pool.query(`INSERT INTO ProductImages (idproduct, linkimage) VALUES ($1, $2)`, [idproduct, link]);
};

const searchImages = async (req, res) => {
    const idproduct = req.params.idproduct;
    pool.query(`SELECT linkimage FROM ProductImages WHERE idproduct = $1`, [idproduct], (err, results) => {
        if (err) return res.status(404).json({ message: 'Error, no se pudo encontrar el producto indicado.' });
        res.status(200).json(results.rows);
    });
};

const deleteImage = async (req, res) => {
    const editId  = req.params.editId ;
    try {
                // Eliminar la referencia en la base de datos
        pool.query(`DELETE FROM productimages WHERE idproduct = '${editId}'`, (dbErr) => {
            if (dbErr) {
                console.error('Error deleting image record from database:', dbErr);
                    return res.status(500).json({ message: 'Failed to delete image record from database.' });
                }
                res.status(200).json({ message: 'Image successfully deleted.' });
            });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};


const getCategories = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.status(200).json(response.rows);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

const createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    try {
        const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
        const result = await pool.query(query, [name]);
        res.status(201).json(result.rows[0]); // Devuelve la categoría creada
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

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
    deleteImage,
    getProductByidCategory,
    getCategories,
    createCategory
};
