const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/bd")

const userModel = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
})

module.exports = {
    buscarUm: async function (username) {
        return await userModel.findOne(
            { where: { username: username } }
        )
    },

    criar: async function (object) {
        return await userModel.create({
            username: object.username,
            password: object.password,
            admin: object.admin
        })
    },

    editar: async function (username, object) {
        const existingUser = await userModel.findOne({ where: { username: username } });

        if (existingUser) {
            return await existingUser.update({
                username: object.username,
                password: object.password,
                admin: object.admin
            });
        } else {
            throw new Error(`Usuário com o nome ${username} não encontrado.`);
        }
    },

    autenticar: async function (username, password) {
        const user = await this.buscarUm(username);
        if (user && password === user.password) {
            return user;
        } else {
            return null;
        }
    },

    verificarCadastro: async function (obj) {
        return await userModel.findOne(
            {
                where: {
                    username: obj.username,
                    password: obj.password,
                }
            }
        )
    },

    deletar: async function (username) {
        return await userModel.destroy(
            { where: { username: username } }
        )
    },

    Model: userModel
}