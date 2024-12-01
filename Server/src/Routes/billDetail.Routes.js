const { Router } = require('express');
const router = Router();

const { getBillDetail, createBill_Detail, getBill_DetailbyBill, getBill_DetailbyProduct, deleteBill_Detail, updateBill_Detail } = require('../Controllers/bill_detailController')

router.get('/detallefactura', getBillDetail);
router.get('/detallefactura/:idfactura', getBill_DetailbyBill);
router.get('/detallefacturaproduct/:idproducto', getBill_DetailbyProduct);
router.post('/detallefactura', createBill_Detail)
router.delete('/detallefactura/:idproducto:idfactura', deleteBill_Detail)
router.put('/detallefactura/:idproducto:idfactura', updateBill_Detail)

module.exports = router;