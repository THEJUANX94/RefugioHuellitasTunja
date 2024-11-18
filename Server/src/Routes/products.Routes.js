const { Router } = require('express');
const router = Router();

const { getProducts, createProduct, getProductByidproduct, deleteProduct, updateProduct , inventoryPerProduct } = require('../Controllers/productsController')

router.get('/producto', getProducts);
router.get('/producto/:idproducto', getProductByidproduct);
router.post('/producto', createProduct)
router.delete('/producto/:idproducto', deleteProduct)
router.put('/producto/:idproducto', updateProduct)
router.get('/inventory/:idproduct', inventoryPerProduct)

module.exports = router;