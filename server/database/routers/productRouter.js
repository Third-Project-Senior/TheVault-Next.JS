const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Routes
router.get("/", productController.getAllProducts); // Get all products
router.get("/:id", productController.getProductById); // Get a product by ID
router.post("/", productController.createProduct); // Create a product
router.put("/:id", productController.updateProduct); // Update a product
router.delete("/:id", productController.deleteProduct); // Delete a product

module.exports = router;