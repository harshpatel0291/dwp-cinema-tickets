/**
 * @namespace src/Middleware
 * @function queryValidator
 * @description Middleware class providing validation for request body object
 * @param {Schema} schema Joi schema
 * @param {Object} options Joi validate options
 * @param {Request} request The request that caused the controller to run
 * @param {Response} res The HTTP response that the app sends
 * @param {Next} next To pass control to the next middleware function
 * @return {Mixed}
 * @author Harsh Patel
 */
const bodyValidator = (schema, options) => {
  return async (request, res, next) => {
    try {
      options = getValidatorOptions(options);
      request.body = await schema.validateAsync(request.body, options);
      next();
    } catch (error) {
      return res.status(422).json(
          error.details.map((e) => ({[e.context.label]: e.context.message || e.message})),
      );
    }
  };
};

/**
 * @function getValidatorOptions
 * @description Merge default validator options with local
 * @param {Object} options Local Joi validate options
 * @return {Object} Validator options
 */
const getValidatorOptions = (options = {}) => {
  return {...options, abortEarly: false, stripUnknown: true};
};

module.exports = {bodyValidator};
