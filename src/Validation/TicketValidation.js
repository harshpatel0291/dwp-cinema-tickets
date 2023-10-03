const Joi = require('joi');

const schema = Joi.object().keys({
  accountId: Joi.number().integer().min(1).required(),
  tickets: Joi.array().items(
      Joi.object().keys({
        type: Joi.string().valid('ADULT', 'CHILD', 'INFANT').required(),
        quantity: Joi.number().integer().min(1).max(20).required(),
      }),
  ).min(1).max(3).required(),
});


module.exports = schema;
