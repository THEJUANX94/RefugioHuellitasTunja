const { Router } = require('express');
const router = Router();

const { getProducto, createProducto, getProductoByidproducto, deleteProducto, updateProducto } = require('../controller/producto.controller')

router.get('/producto', getProducto);
router.get('/producto/:idproducto', getProductoByidproducto);
router.post('/producto', createProducto)
router.delete('/producto/:idproducto', deleteProducto)
router.put('/producto/:idproducto', updateProducto)

module.exports = router;