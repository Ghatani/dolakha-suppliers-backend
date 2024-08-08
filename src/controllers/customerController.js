const Customer = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
    const { name, contactInfo, addressInfo } = req.body;

    try {
        const customer = new Customer({ name, contactInfo, addressInfo });

        await customer.save();

        res.status(201).json({
            customer,
            message: "Created Sucessfully",
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();

        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateCustomer = async (req, res) => {
    const { name, contactInfo, addressInfo } = req.body;

    try {
        const customer = await Customer.findById(req.params.id);

        if (customer) {
            customer.name = name || customer.name;
            customer.contactInfo = contactInfo || customer.contactInfo;
            customer.addressInfo = addressInfo || customer.addressInfo;

            const updatedCustomer = await customer.save();

            res.json(updatedCustomer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (customer) {
            await customer.remove();

            res.json({ message: 'Customer removed' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
