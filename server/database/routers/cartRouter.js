const express = require("express");
const cartController = require("../controllers/cartController");
const { authenticate } = require("../controllers/userController"); // Middleware for authentication

const router = express.Router();

// Routes (Protected routes require authentication)
router.get("/", authenticate, cartController.getAllCartItems); // Get all cart items
router.get("/:id", cartController.getCartByUserId); // Get cart by user ID
router.post("/", cartController.addToCart); // Add a product to the cart
router.put("/:id",  cartController.updateCartItem); // Update cart item
router.delete("/:id", cartController.removeFromCart); // Remove an item from the cart

module.exports = router;