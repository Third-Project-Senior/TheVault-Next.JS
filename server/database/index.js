const { Sequelize, DataTypes } = require('sequelize');
const { PostgresDialect } = require('@sequelize/postgres');
const postgres = require('pg');
const comment = require('./models/comment');

const connection = new Sequelize({
  dialect: 'postgres',
  database: 'vault',
  username: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  logging: false,
  ssl: false,
  dialectOptions: {
    clientMinMessages: 'notice', // Move clientMinMessages here
  },
});

connection.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const User = require('./models/user')(connection, DataTypes);
const Cart = require('./models/cart')(connection, DataTypes);
const Product = require('./models/Product')(connection, DataTypes);
const Category = require('./models/categorie')(connection, DataTypes);
const Comment = require('./models/comment')(connection, DataTypes);

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Comment, { foreignKey: 'productId' });
Comment.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });



// connection.sync({force:true})
// .then(() => {
//     console.log('All models were synchronized successfully.');
// })
// .catch(err => console.error('Unable to synchronize models:', err));

module.exports = { connection, User, Cart, Product ,Category,Comment};

