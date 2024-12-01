const { Router } = require('express');
const router = Router();

const { getLot, createLot, getLotByidlot, deleteLot, updateLot, getLotsWithProducts } = require('../Controllers/lotController')

router.get('/lote', getLot);
router.get('/lote/:idlote', getLotByidlot);
router.post('/lote', createLot)
router.delete('/lote/:idlote', deleteLot)
router.put('/lote/:idlote', updateLot)
router.get('/lote-producto/', getLotsWithProducts)

module.exports = router;