const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');

exports.createOrder = async (req, res) => {
    const { customer, products, totalAmount, assignedDriver } = req.body;

    try {
        const order = new Order({
            customer,
            products,
            totalAmount,
            assignedDriver,
        });

        await order.save();

        // Update customer's order history
        const customerRecord = await Customer.findById(customer);
        customerRecord.orderHistory.push(order._id);
        await customerRecord.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer assignedDriver');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer assignedDriver');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrder = async (req, res) => {
    const { status, assignedDriver } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status || order.status;
            order.assignedDriver = assignedDriver || order.assignedDriver;

            const updatedOrder = await order.save();

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.remove();

            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

