const ticketTypes = ['ADULT', 'CHILD', 'INFANT'];

/**
 * @namespace src/Request
 * @class TicketRequest
 * @description Ticket request immutable object class
 * @author Harsh Patel
 * @license MIT
 */
class TicketRequest {
  /**
    * @public @method constructor
    * @description Base method when instantiating class
    * @param {String} type Ticket type
    * @param {Number} quantity Ticket uantity
    */
  constructor(type, quantity) {
    if (!ticketTypes.includes(type)) {
      throw new TypeError(`Type must be ${ticketTypes.slice(0, -1).join(', ')}, or ${ticketTypes.slice(-1)}`);
    }

    if (!Number.isInteger(quantity)) {
      throw new TypeError('Quantity must be an integer');
    }

    this.type = type;
    this.quantity = quantity;
  }

  /**
    * @public @method getQuantity
    * @description Get ticket quantity
    * @return {Number} Ticket quantity
    */
  getQuantity() {
    return this.quantity;
  }

  /**
    * @public @method getType
    * @description Get ticket type
    * @return {String} Ticket type
    */
  getType() {
    return this.type;
  }
}

module.exports = TicketRequest;
