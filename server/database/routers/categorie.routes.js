const express = require('express');
const categoryController = require('../controllers/categorie.controller');
const CategRouter = express.Router();

// Routes
CategRouter.get('/getAll', categoryController.getAllCategories)


module.exports = CategRouter;