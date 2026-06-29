const express = require('express');
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');

const checkRole = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'fornecedor' || req.user.role === 'medico')) {
        return next();
    }
    return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para esta ação.' });
};

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, checkRole, createProduct);
router.put('/:id', authMiddleware, checkRole, updateProduct);
router.delete('/:id', authMiddleware, checkRole, deleteProduct);

module.exports = router;