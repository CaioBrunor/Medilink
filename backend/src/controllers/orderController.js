const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'O pedido precisa conter pelo menos um produto.' });
        }

        let total = 0;

        for (let item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
            }
            total += product.price * item.quantity;
        }

        const order = await Order.create({
            user: req.user.id,
            products,
            total,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar pedido.', error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.productId');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedidos.', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('products.productId');
            
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o pedido.', error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true },
        );

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status do pedido.', error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }
        res.json({ message: 'Pedido removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar pedido.', error: error.message });
    }
};