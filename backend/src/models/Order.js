const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: Number,
            },
        ],
        total: Number,
        status: {
            type: String,
            default: 'pendente', // pendente | pago | cancelado
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Order', orderSchema)
