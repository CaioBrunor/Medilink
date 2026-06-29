const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'Este e-mail já está cadastrado.' });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hash,
            role: role || 'user',
        });

        user.password = undefined;

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao registrar usuário.', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Por favor, informe e-mail e senha.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ msg: 'Senha inválida.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret_fallback',
            { expiresIn: '7d' }
        );

        user.password = undefined;

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao realizar login.', error: error.message });
    }
};