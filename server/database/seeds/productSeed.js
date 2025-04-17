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
                categoryId: Military.id
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
            },
            {
                name: 'Retro Typewriter',
                description: 'Vintage 1940s manual typewriter in excellent condition',
                price: 279.99,
                quantity: 3,
                image: 'https://m.media-amazon.com/images/I/71b3ABbZ4zL._AC_UF894,1000_QL80_.jpg',
                categoryId: Electronics.id
            },
            {
                name: 'Old Film Camera',
                description: 'Classic 35mm film camera for photography lovers',
                price: 189.99,
                quantity: 4,
                image: 'https://img2.cgtrader.com/items/3177072/188ca0b033/large/3d-old-film-camera-3d-model-rigged-blend.jpg',
                categoryId: Electronics.id
            },
            {
                name: 'Victorian Parasol',
                description: 'Handcrafted lace parasol from the Victorian era',
                price: 129.99,
                quantity: 2,
                image: 'https://recollections.biz/blog/wp-content/uploads/2022/03/parasol-1880MET.jpg',
                categoryId: Clothes.id
            },
            {
                name: 'Antique Telescope',
                description: '19th-century brass telescope with tripod',
                price: 649.99,
                quantity: 1,
                image: 'https://redcarpettelescopes.com/cdn/shop/products/Hampton_Nautical_64-Inch_Floor_Standing_Antique_Brass_Griffith_Astro_Telescope_1200x600_crop_center.jpg?v=1706928359'
            },
            {
                name: 'Classic Phonograph',
                description: 'Early 1900s phonograph with brass horn and wooden base',
                price: 559.99,
                quantity: 2,
                image: 'https://www.pyleaudio.com/1000/PTCDCS3UIP.jpg',
                categoryId: Electronics.id
            },
            {
                name: 'Antique Wall Clock',
                description: 'Pendulum wall clock from 1800s, still ticking',
                price: 249.99,
                quantity: 5,
                image: 'https://www.sellingantiques.co.uk/img/categories_img/antique-clocks/antique-wall-clocks.jpg',
                categoryId: Mechanicals.id
            },
            {
                name: 'Renaissance Gown',
                description: 'Luxurious 16th-century styled gown with gold embroidery',
                price: 349.99,
                quantity: 1,
                image: 'https://www.medievalcollectibles.com/wp-content/uploads/2019/03/MCI-105.jpg',
                categoryId: Clothes.id
            },
            {
                name: 'Old World Globe',
                description: 'Antique globe showing 18th-century world geography',
                price: 229.99,
                quantity: 3,
                image: 'https://i5.walmartimages.com/seo/HeroNeo-Geography-Globe-Antique-World-Globe-with-Stand-Full-Earth-Geography-Map_83d1f110-9cbf-41af-8e88-8717899b3ec4.865a2bafa576f321ac9386edb0e1d426.jpeg',
                categoryId: Books.id
            },
            {
                name: 'Vintage Military Binoculars',
                description: 'Used during WWII, original leather case included',
                price: 179.99,
                quantity: 6,
                image: 'https://i0.wp.com/roots-revived.com/wp-content/uploads/2022/05/antique-1800s-19th-century-vintage-french-military-army-navy-binoculars-decor-leather-case-black-gear-19.jpg?fit=3468%2C3468&ssl=1',
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