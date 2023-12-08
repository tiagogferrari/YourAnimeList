const Joi = require('joi')

const animeSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .required()
        .max(20),
    score: Joi.number()
        .min(0)
        .required()
        .max(10.0),
    episodes: Joi.number()
        .required()
        .integer()
        .min(1)
        .max(1100)
})

module.exports = {
    valAnime: function (req, res, next) {
        const { error, value } = animeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message })
        }
        req.body = value
        return next()
    },
}