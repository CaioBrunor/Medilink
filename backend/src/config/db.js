const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB conectado com sucesso')
    } catch (error) {
        console.log('Erro ao conectar MongoDB')
    }
}

module.exports = connectDB
