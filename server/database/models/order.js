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
        shippingAddress: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        items: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending',
            validate: {
                isIn: [['pending', 'paid', 'failed', 'refunded']]
            }
        }
    });

    // Define the association with User
    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Order;
} 