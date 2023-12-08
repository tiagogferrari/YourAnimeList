const userModel = require('../model/Usuario')

//jsonwebtoken; uma biblioteca popular utilizada para geração e verificação de JSON 
const jwt = require('jsonwebtoken')

module.exports = {
    autenticador: async function (req, res, next) {
        //extrai o token de autorização do cabeçalho da solicitação
        const token = req.headers['authorization']
        if (!token) {
            return res.status(401).json({ status: false, mensagem: 'Dados não encontrados' })
        }

        //retorna um array com a palavra bearer e o valor do token separados
        const [bearer, tokenValue] = token.split(' ')
        if (bearer !== 'Bearer') {
            return res.status(400).json({ status: false, mensagem: 'Não é Bearer' })
        }

        try {
            //verifica e decodifica um token JWT, e atribui seu conteudo à usuario
            jwt.verify(tokenValue, process.env.SECRET)
            next()
        } catch (error) {
            return res.status(401).json({ status: false, mensagem: 'O token é invalido!' })
        }
    }
}