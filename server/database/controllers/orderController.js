const { Order, User } = require('../index');

const orderController = {
    // Create a new order
    createOrder: async (req, res) => {
        try {
            const { userId, totalAmount, shippingAddress, items, paymentMethod } = req.body;
            
            const order = await Order.create({
                userId,
                totalAmount,
                shippingAddress,
                items,
                paymentMethod,
                status: 'pending',
                paymentStatus: 'pending'
            });

            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all orders for a specific user
    getUserOrders: async (req, res) => {
        try {
            const { userId } = req.params;
            
            const orders = await Order.findAll({
                // where: { userId },
                order: [['createdAt', 'DESC']]
            });

            res.json(orders);
        } catch (error) {
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