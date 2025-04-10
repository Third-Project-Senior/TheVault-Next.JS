
module.exports =(connection, DataTypes) => {
    const cart = connection.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
        
    });
    return cart;
}