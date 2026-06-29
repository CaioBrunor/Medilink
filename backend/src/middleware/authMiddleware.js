const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não enviado' })
    }

    const parts = authHeader.split(' ')
    const token = parts.length === 2 ? parts[1] : parts[0]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' })
    }
}

module.exports = authMiddleware