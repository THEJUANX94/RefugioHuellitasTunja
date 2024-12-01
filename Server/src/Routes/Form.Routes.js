const express = require('express');
const { uploadForm, getForm} = require('../Controllers/FormsController');
const router = express.Router();

router.post('/form', async (req, res) => {
  try {
      const data = req.body;
      const login = req.body.login;
      delete data.login;

      const response = await uploadForm(data, login);
      res.status(200).json(response); // Respuesta exitosa
  } catch (error) {
      console.error("Error en /form:", error.message);
      res.status(500).json({ message: "Error al procesar la solicitud", details: error.message });
  }
});

router.get('/form/:idform', getForm);

module.exports = router;