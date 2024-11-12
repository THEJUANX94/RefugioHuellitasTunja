const express = require('express');
const { uploadForm, getForm } = require('../Controllers/FormsController');
const router = express.Router();

router.post('/form', async (req, res) => {
    const data = req.body;
    const login = req.body.login
    delete data.login
    try {
      const response = await uploadForm(data, login);
      res.status(200).json(response); // Send response to client
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'); // Handle errors gracefully
    }
  });

router.get('/form/:idform', getForm);

module.exports = router;