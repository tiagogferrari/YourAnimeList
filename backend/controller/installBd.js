const express = require("express")
const router = express.Router()

const sequelize = require("../helpers/bd")
const userModel = require("../model/Usuario")
const animeModel = require("../model/Anime")

router.get('/', async (req, res) => {
    await sequelize.sync({ force: false })
    try {

        await userModel.criar({ username: 'tiago', password: '123456', admin: 'true' })
        await userModel.criar({ username: 'admin', password: 'admin', admin: 'true' })
        await userModel.criar({ username: 'claudio', password: '123654', admin: 'false' })
        await userModel.criar({ username: 'arthur', password: '654321', admin: 'false' })
        await userModel.criar({ username: 'vinicius', password: '654123', admin: 'false' })
        await userModel.criar({ username: 'gabriel', password: '321456', admin: 'false' })

        await animeModel.criar({ title: 'Hunter x Hunter', score: '9.04', episodes: '148' })
        await animeModel.criar({ title: 'One Piece', score: '8.71', episodes: '1083' })
        await animeModel.criar({ title: 'Demon Slayer', score: '8.49', episodes: '55' })
        await animeModel.criar({ title: 'Jujutsu Kaisen', score: '8.63', episodes: '48' })
        await animeModel.criar({ title: 'Black Clover', score: '8.15', episodes: '170' })

    } catch (error) {
        res.json('Erro ao instalar Banco de Dados' + error.name)
    }

})

module.exports = router
