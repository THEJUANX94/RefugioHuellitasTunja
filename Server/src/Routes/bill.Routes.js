const { Router } = require('express');
const router = Router();

const { getBill, createBill, getBillByID, deleteBill } = require('../Controllers/Billcontroller')

router.get('/factura', getBill);
router.get('/factura/:idfactura', getBillByID);
router.post('/factura', createBill)
router.delete('/factura/:idfactura', deleteBill)

module.exports = router;