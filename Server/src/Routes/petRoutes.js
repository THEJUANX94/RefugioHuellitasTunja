// backend/routes/userRoutes.js
const express = require('express');
const { createPet, getPets, getPetsById, updatePet, deletePet } = require('../Controllers/petController.js');
const router = express.Router();

router.post('/pets', createPet);
router.get('/pets', getPets);
router.get('/pets/:idpet', getPetsById);
router.put('/pets/:idpet', updatePet);
router.delete('/pets/:idpet', deletePet);

module.exports = router;