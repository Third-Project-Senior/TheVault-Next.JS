const { connection, Category } = require('../index.js');

const seedCategories = async () => {
  try {
    await Category.destroy({ where: {} }); // Clear existing categories
    
    
    const categories = [
      { name: 'Electronics' , image: 'https://images.stockcake.com/public/3/7/1/3711971e-a19f-4e6f-a2b1-18d6d2a4539f_large/vintage-electronics-collection-stockcake.jpg' },
      { name: 'Clothes' , image: 'https://i.pinimg.com/474x/53/47/b4/5347b4a26fab7b751b0b1fcd96974d3a.jpg' },
      { name: 'Books' , image: 'https://media.istockphoto.com/id/185215276/photo/antique-books-in-a-library.jpg?s=612x612&w=0&k=20&c=G65nHS2qkFo0I_uEix23ZNiq5QuQBrZOcUlDYg-uarg=' },
      { name: 'Mechanicals', image: 'https://images.stockcake.com/public/4/9/0/4907df59-e37c-45f7-8302-411f647493fc_medium/vintage-watch-workshop-stockcake.jpg' },
      { name: 'Military' , image: 'https://media.istockphoto.com/id/124589002/photo/world-war-ii-soldiers-in-battle.jpg?s=612x612&w=0&k=20&c=WYbVCqsG0ZsvHvdPVN6fnqvRjG--dADPYsGy0v20aZc=' },
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