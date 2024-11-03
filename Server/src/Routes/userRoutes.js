// backend/routes/userRoutes.js
const express = require('express');
const { getUsers, createUser, getUserbyLogin, updateUser, deleteUser } = require('../Controllers/userController');
const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:login', getUserbyLogin);
router.post('/users', createUser);
router.put('/users/:login', updateUser);
router.delete('/users/:login', deleteUser);

module.exports = router;
