const { Cart, Product } = require("../index.js"); 
module.exports = {
  getAllCartItems: async (req, res) => {
    try {
      const cartItems = await Cart.findAll();
      res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getCartByUserId: async (req, res) => {
    const userId =req.params.id 
  
    try {
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: 'Product',
            attributes: ['id', 'name', 'price', 'image'], 
          },
        ],
      });
  
      res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error fetching cart with product details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
,  

  addToCart: async (req, res) => {
    const { productId, quantity, userId } = req.body;
    console.log('Received cart request:', { productId, quantity, userId });

    if (!productId || !quantity || !userId) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["productId", "quantity", "userId"]
      });
    }

    try {
      const product = await Product.findByPk(productId);
      console.log('Found product:', product);
  
      if (!product) {
        console.log('Product not found with ID:', productId);
        return res.status(404).json({ message: "Product not found" });
      }

      // Ensure price is a number and quantity is a positive integer
      const price = parseFloat(product.price);
      const qty = parseInt(quantity);
      
      if (isNaN(price) || isNaN(qty) || qty <= 0) {
        return res.status(400).json({ 
          message: "Invalid price or quantity",
          price: product.price,
          quantity: quantity
        });
      }

      const totalPrice = (price * qty).toFixed(2);
      console.log('Calculated total price:', totalPrice);

      const cartItem = await Cart.create({
        userId,
        productId,
        quantity: qty,
        totalPrice,
      });
      console.log('Created cart item:', cartItem);

      res.status(201).json({ 
        message: "Product added to cart", 
        cartItem: {
          id: cartItem.id,
          userId: cartItem.userId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          totalPrice: cartItem.totalPrice
        }
      });
    } catch (error) {
      console.error("Detailed error adding to cart:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message 
      });
    }
  },

  updateCartItem: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const cartItem = await Cart.findByPk(id);
      if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

      const product = await Product.findByPk(cartItem.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const totalPrice = product.price * quantity;

      await cartItem.update({ quantity, totalPrice });

      res.status(200).json({ message: "Cart item updated", cartItem });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  removeFromCart: async (req, res) => {
    const { id } = req.params;
    try {
      const cartItem = await Cart.findByPk(id);
      if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

      await cartItem.destroy();
      res.status(200).json({ message: "Cart item removed" });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
