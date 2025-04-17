const { Order, User, Product, OrderItem } = require('../index');

const orderController = {
    // Create a new order
    createOrder: async (req, res) => {
        try {
            const { userId, totalAmount, items, paymentMethod } = req.body;
            
            // Create the order
            const order = await Order.create({
                userId,
                totalAmount,
                paymentMethod,
                
            });

            // Create order items
            const orderItems = await Promise.all(
                items.map(item => 
                    OrderItem.create({
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    })
                )
            );

            // Fetch the complete order with items
            const completeOrder = await Order.findByPk(order.id, {
                include: [{
                    model: Product,
                    as: 'items',
                    through: {
                        attributes: ['quantity', 'price']
                    }
                }]
            });

            res.status(201).json(completeOrder);
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // get all orders

    getOrders: async (req, res) => {
        try {
            
            const orders = await Order.findAll({
                
                include: [{
                    model: Product,
                    as: 'items',
                    through: {
                        attributes: ['quantity', 'price']
                    }
                }],
                order: [['createdAt', 'DESC']]
            });

            // Transform the data to match the expected format
            const transformedOrders = orders.map(order => {
                const plainOrder = order.get({ plain: true });
                return {
                    ...plainOrder,
                    items: plainOrder.items.map(item => ({
                        quantity: item.OrderItem.quantity,
                        product: {
                            id: item.id,
                            name: item.name,
                            price: item.OrderItem.price,
                            image: item.image
                        }
                    }))
                };
            });

            res.json(transformedOrders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Get all orders for a specific user
    getUserOrders: async (req, res) => {
        try {
            const { userId } = req.params;
            
            const orders = await Order.findAll({
                where: { userId },
                include: [{
                    model: Product,
                    as: 'items',
                    through: {
                        attributes: ['quantity', 'price']
                    }
                }],
                order: [['createdAt', 'DESC']]
            });

            // Transform the data to match the expected format
            const transformedOrders = orders.map(order => {
                const plainOrder = order.get({ plain: true });
                return {
                    ...plainOrder,
                    items: plainOrder.items.map(item => ({
                        quantity: item.OrderItem.quantity,
                        product: {
                            id: item.id,
                            name: item.name,
                            price: item.OrderItem.price,
                            image: item.image
                        }
                    }))
                };
            });

            res.json(transformedOrders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Get a single order by ID
    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const order = await Order.findByPk(id, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }, {
                    model: Product,
                    as: 'items',
                    through: {
                        attributes: ['quantity', 'price']
                    }
                }]
            });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update order status
    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.status = status;
            await order.save();

            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update payment status
    updatePaymentStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { paymentStatus } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.paymentStatus = paymentStatus;
            await order.save();

            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = orderController; 