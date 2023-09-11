const Joi = require('joi');

module.exports.trackSchema = Joi.object({
    track: Joi.object({
        title: Joi.string().required(),
        length: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required(),
        artist: Joi.string().required(),
    }).required()
});