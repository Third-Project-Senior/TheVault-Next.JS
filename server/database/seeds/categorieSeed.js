const { connection, Category } = require('../index.js');

const seedCategories = async () => {
  try {
    await Category.destroy({ where: {} }); // Clear existing categories
    
    
    const categories = [
      { name: 'Electronics' },
      { name: 'Clothes' },
      { name: 'Books' },
      { name: 'Mechanicals' },
      { name: 'Military' },
    ];

    await Category.bulkCreate(categories);
    console.log('Categories seeded successfully.');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await connection.close();
    console.log('Database connection closed.');
  }
};

seedCategories();