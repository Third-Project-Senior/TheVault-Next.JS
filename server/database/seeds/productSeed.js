const {connection, Product, Category} = require('../index.js');
const { Sequelize, DataTypes } = require('sequelize');

const seedProducts = async () => {  
    try {
        await Product.destroy({ where: {} }); // Clear existing products

        const Electronics = await Category.findOne({ where: { name: 'Electronics' } });
        const Clothes = await Category.findOne({ where: { name: 'Clothes' } });
        const Books = await Category.findOne({ where: { name: 'Books' } });
        const Mechanicals = await Category.findOne({ where: { name: 'Mechanicals' } });
        const Military = await Category.findOne({ where: { name: 'Military' } });

        const products = [
            {
                
                name: 'Vintage Radio', 
                description: 'Classic 1950s radio in working condition',
                price: 299.99, 
                quantity: 5, 
                image: 'https://img.freepik.com/psd-gratuit/radio-vintage-est-souvenir-du-passe_632498-24155.jpg?semt=ais_country_boost&w=740',
                categoryId: Electronics.id
            },
            {
                
                name: 'Antique Gramophone',
                description: 'Early 20th-century gramophone with brass horn', 
                price: 499.99, 
                quantity: 3, 
                image: 'https://i.ebayimg.com/images/g/Wr4AAOSwYpFjglGw/s-l1200.jpg',
                categoryId: Electronics.id
            },
            {
                
                name: 'Victorian Dress',
                description: 'Elegant Victorian-era dress with lace details',
                price: 199.99,
                quantity: 2,
                image: 'https://res.cloudinary.com/odysseytraveller/image/fetch/f_auto,q_auto,dpr_auto,r_4,w_765,h_1071,c_limit/https://cdn.odysseytraveller.com/app/uploads/2018/12/DP321110.jpg',
                categoryId: Clothes.id
            },
            {
                
                name: 'Military Jacket',
                description: 'World War II-era military jacket',
                price: 149.99,
                quantity: 4,
                image: 'https://i.etsystatic.com/16495683/r/il/823ff1/4357334694/il_570xN.4357334694_si9f.jpg',
                categoryId: Clothes.id
            },
            {
                
                name: 'First Edition Novel',
                description: 'Rare first edition of a classic novel',
                price: 999.99,
                quantity: 1,
                image: 'https://robbreport.com/wp-content/uploads/2016/10/grest-gatsby-first-editions-lead.jpg?w=772',
                categoryId: Books.id
            },
            {
                
                name: 'Antique Map',
                description: '17th-century hand-drawn map',
                price: 799.99,
                quantity: 2,
                image: 'https://m.media-amazon.com/images/I/71PfXNSOcnL._AC_SL1200_.jpg',
                categoryId: Books.id
            },
            {
                name: 'Vintage Pocket Watch',
                description: '19th-century pocket watch with intricate engravings',
                price: 349.99,
                quantity: 6,
                image: 'https://www.thevintagegentlemen.com/cdn/shop/products/image_9ad8825f-c979-49f5-a480-d0f2039c7441_1200x.png?v=1571608978',
                categoryId: Mechanicals.id
            },
            {
                
                name: 'Antique Compass',
                description: 'Brass compass from the 1800s',
                price: 199.99,
                quantity: 8,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPUvMz_5fBGFyRx87aA_bg3YK30-W8fxieQ&s',
                categoryId: Mechanicals.id
            },
            {
                
                name: 'Medieval Sword',
                description: 'Authentic medieval sword with scabbard',
                price: 1299.99,
                quantity: 1,
                image: 'https://todcutler.com/cdn/shop/files/TCS1group_2.jpg?v=1686779749&width=1445',
                categoryId: Military.id
            },
            {
                
                name: 'Antique Helmet',
                description: '16th-century steel helmet used in battle',
                price: 899.99,
                quantity: 2,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsY3MWVxXUKJB3FaIaLpkEpvyBpndRw2dw_1AYLys721GieRoQ-9tBZHsQBQ2MCnmecLE&usqp=CAU',
                categoryId: Military.id
            }
        ];

        await Product.bulkCreate(products);
        console.log('Products seeded successfully.');
    }
    catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        await connection.close();
        console.log('Database connection closed.');
    }   
};

seedProducts();