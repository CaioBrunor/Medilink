const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({ message: 'Nome e preço são obrigatórios.' });
        }

        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar produto.', error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos.', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o produto.', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true 
        });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto.', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar produto.', error: error.message });
    }
};