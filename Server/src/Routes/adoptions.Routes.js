const { Router } = require('express');
const router = Router();
const {
    createAdoption,
    getAdoptions,
    getAdoptionById,
    updateAdoption,
    deleteAdoption,
    updateOtherAdoptions,
} = require('../Controllers/AdoptionsController');

router.post('/adoptions', createAdoption); // Crear adopción
router.get('/adoptions', getAdoptions); // Obtener todas las adopciones
router.get('/adoptions/:idpet/:idform', getAdoptionById); // Obtener adopción por idpet e idform
router.put('/adoptions/:idpet/:idform', updateAdoption); // Actualizar adopción
router.delete('/adoptions/:idpet/:idform', deleteAdoption); // Eliminar adopción
router.put('/adoptions/deny-others/:idpet/:idform', updateOtherAdoptions);

module.exports = router;
