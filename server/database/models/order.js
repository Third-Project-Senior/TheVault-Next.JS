module.exports = (connection, DataTypes) => {
    const Order = connection.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending',
            validate: {
                isIn: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']]
            }
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'paid',
            validate: {
                isIn: [['pending', 'paid', 'failed', 'refunded']]
            }
        }
    });

    // Define associations
    Order.associate = (models) => {
        // Association with User
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        // Association with Products through OrderItems
        Order.belongsToMany(models.Product, {
            through: 'OrderItems',
            foreignKey: 'orderId',
            as: 'items'
        });
    };

    return Order;
} 