const express = require('express');
const {
    getDonations,
    createDonation,
    getDonationByID,
    deleteDonation
} = require('../Controllers/DonateController');

const router = express.Router();

router.get('/donate/get', getDonations);          // Obtener todas las donaciones
router.get('/donate/get/:id', getDonationByID);    // Obtener una donación por ID
router.post('/donate/create', createDonation);       // Crear una nueva donación
router.delete('/donate/delete/:id', deleteDonation);  // Eliminar una donación por ID

module.exports = router;
