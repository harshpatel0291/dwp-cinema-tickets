/**
 * @namespace src/Error
 * @class InvalidPurchaseException
 * @extends Error
 * @description System class to give extended error functionality for Invalid Purchase error, for returning back to client
 * @author Harsh Patel
 * @license MIT
 */
class InvalidPurchaseException extends Error {
  /**
    * @public @method constructor
    * @description Base method when instantiating class
    * @param {String} message The message to pass in as the error message
    * @param {Number} status The rest error code to output, along with the message
    */
  constructor(message, status) {
    super(message);
    this.status = status || 400;
  }
};

module.exports = InvalidPurchaseException;
