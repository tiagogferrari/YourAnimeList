const express = require('express')
const router = express.Router()
const userModel = require('../model/Usuario');
const jwt = require('jsonwebtoken');

// Rota para buscar um usuário pelo nome de usuário
router.get('/user/:username', async (req, res) => {
    try {
        const usuario = await userModel.buscarUm(req.params.username);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//rota de login
router.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validação de entradas
        if (!username || !password) {
            return res.status(400).json({ error: 'Informe nome de usuário e senha.' });
        }

        const user = await userModel.autenticar(username, password);

        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login bem-sucedido', user, token });
        } else {
            res.status(401).json({ error: 'Nome de usuário ou senha inválidos.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
});

// Rota para atualizar um usuário existente
router.put('/user/:username', async (req, res) => {
    try {
        await userModel.editar(req.params.username, req.body);
        res.json({ message: 'Usuário atualizado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para excluir um usuário pelo nome de usuário
router.delete('/user/:username', async (req, res) => {
    try {
        await userModel.deletar(req.params.username);
        res.json({ message: 'Usuário excluído' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router
