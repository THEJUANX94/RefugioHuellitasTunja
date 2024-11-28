// backend/routes/userRoutes.js
const express = require('express');
const { createPet, getPets, getPetsById, updatePet, deletePet, uploadImages, newImage, searchImages, getSpecies, getRacesBySpecies} = require('../Controllers/petController.js');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

router.post('/pets', createPet);
router.get('/pets', getPets);
router.get('/pets/:idpet', getPetsById);
router.put('/pets/:idpet', updatePet);
router.delete('/pets/:idpet', deletePet);
router.get('/species', getSpecies);
router.get('/races/:idspecies', getRacesBySpecies);
router.get('/images/:idpet', searchImages);
router.post('/upload/:idpet', uploadImages.single('image'), async (req, res) => {
    try {
      // Upload the file to Cloudinary using the uploaded file path
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pets', // Folder in Cloudinary to store images
      });
      newImage(req, res, result.secure_url);
      // Respond with the secure URL of the uploaded image
      res.json({ secure_url: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al subir la imagen' });
    } finally {
      if (req.file?.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error eliminando el archivo:', err);
          } else {
            console.log('Archivo eliminado exitosamente:', req.file.path);
          }
        });
      }
    }
  });


module.exports = router;