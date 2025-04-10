const { Product } = require("../index.js"); // Adjust path if necessary

module.exports = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get a product by ID
  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    // const { name, description, price, quantity, image, category } = req.body;
    try {
      const newProduct = await Product.create(
      req.body
      );

      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json(error);
    }
  },

  // Update a product
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity, image, category, rating } = req.body;

    try {
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        quantity: quantity || product.quantity,
        image: image || product.image,
        category: category || product.category,
        rating: rating || product.rating,
      });

      res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
