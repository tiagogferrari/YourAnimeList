const express = require('express')
const router = express.Router()
const Anime = require('../model/Anime');
const autenticador = require('../helpers/Auth')
const validar = require('../validators/valAnime')

const cache = require('express-redis-cache')()

cache.invalidate = (name) => {
    return (req, res, next) => {
        const nomeRota = name ? name : '/anime/anime?*'
        if(!cache.connected) {
            next();
            return;
        }
        cache.del(nomeRota, (err) => console.log(err));
        next();
    };
};

// Rota para buscar um anime pelo título
router.get('/anime/:title', autenticador.autenticador, cache.route(), async (req, res) => {
    try {
        const anime = await Anime.buscarUm(req.params.title);
        res.json(anime);
        console.log('retornado do banco de dados')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para buscar todos os animes
router.get('/anime', async (req, res) => {
    try {
        const animes = await Anime.buscarTodos();
        res.json(animes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para criar um anime
router.post('/anime', autenticador.autenticador, validar.valAnime, cache.invalidate(), async (req, res) => {
    try {
        const anime = await Anime.criar(req.body);
        //envia a mensagem pra fila
        res.status(201).json(anime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para atualizar um anime
router.put('/anime/:title', async (req, res) => {
    try {
        await Anime.editar(req.params.title, req.body);
        client.del(`anime:${req.params.title}`);
        res.json({ message: 'Anime atualizado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para excluir um anime
router.delete('/anime/:title', async (req, res) => {
    try {
        await Anime.deletar(req.params.title);
        client.del(`anime:${req.params.title}`);
        res.json({ message: 'Anime excluído' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router
