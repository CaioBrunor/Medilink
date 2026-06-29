const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateStatus,
    deleteOrder
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateStatus);
router.delete('/:id', deleteOrder);

module.exports = router;