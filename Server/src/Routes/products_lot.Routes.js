const { Router } = require('express');
const router = Router();

const { getProducts_lot, createProducts_lot, getProducts_lotbylot, getProducts_lotbyproduct, deleteProducts_lot, updateProducts_lot } = require('../Controllers/products_lotController')

router.get('/productolote', getProducts_lot);
router.get('/productolote/:idlote', getProducts_lotbylot);
router.get('/productolote/:idproducto', getProducts_lotbyproduct);
router.post('/productolote', createProducts_lot)
router.delete('/productolote/:idproducto:idlote', deleteProducts_lot)
router.put('/productolote/:idproducto:idlote', updateProducts_lot)

module.exports = router;