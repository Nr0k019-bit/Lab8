const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Get Method
router.get('/add', productController.addProductPage);
router.get('/edit/:id', productController.editProductPage);
router.get('/delete/:id', productController.deleteProduct);

// Post Method
router.post('/add', productController.addProducts);
router.post('/edit/:id', productController.editProduct);

module.exports = router;
