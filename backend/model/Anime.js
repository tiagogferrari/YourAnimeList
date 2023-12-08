const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/bd")

const animeModel = sequelize.define('Anime', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    episodes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

module.exports = {
    buscarUm: async function (title) {
        return await animeModel.findOne(
            { where: { title: title } }
        )
    },

    buscarTodos: async function () {
        try {
            const animes = await animeModel.findAll();
            return animes;
        } catch (error) {
            console.error("Erro ao buscar animes: ", error);
        }
    },
    

    criar: async function (object) {
        return await animeModel.create({
            title: object.title,
            score: object.score,
            episodes: object.episodes
        })
    },

    editar: async function (title, object) {
        const existingAnime = await animeModel.findOne({ where: { title: title } });

        if (existingAnime) {
            return await existingAnime.update({
                title: object.title,
                score: object.score,
                episodes: object.episodes
            });
        } else {
            throw new Error(`Anime com o título ${title} não encontrado.`);
        }
    },

    deletar: async function (title) {
        return await animeModel.destroy(
            { where: { title: title } }
        )
    },

    Model: animeModel
}