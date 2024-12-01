const { Router } = require('express');
const router = Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { getProducts, createProduct, 
  getProductByidproduct, deleteProduct, 
  updateProduct , inventoryPerProduct, 
  searchImages, newImage , uploadImages, 
  getProductByidCategory, getCategories,
  createCategory, deleteImage} = require('../Controllers/productsController')

router.get('/producto', getProducts);
router.get('/producto/:idproducto', getProductByidproduct);
router.get('producto/:category_id', getProductByidCategory)
router.post('/producto', createProduct)
router.delete('/producto/:id', deleteProduct)
router.put('/producto/:editId', updateProduct)
router.get('/inventory/:idproduct', inventoryPerProduct)
router.get('/categorias', getCategories);
router.post('/categorias', createCategory);
router.get('/productimages/:idproduct', searchImages);
router.delete('/delete-image-product/:editId', deleteImage);
router.post('/productupload/:idproduct', uploadImages.single('image'), async (req, res) => {
    try {
      // Upload the file to Cloudinary using the uploaded file path
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products', // Folder in Cloudinary to store images
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