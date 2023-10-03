const TicketRequest = require('../Request/TicketRequest.js');
const InvalidPurchaseException = require('../Error/InvalidPurchaseException.js');

const TicketPaymentService = require('../Library/ThirdParty/PaymentGateway/TicketPaymentService.js');
const SeatReservationService = require('../Library/ThirdParty/SeatBooking/SeatReservationService.js');

// Define the ticket types and their prices.
const ticketPrices = {
  INFANT: 0,
  CHILD: 10,
  ADULT: 20,
};

/**
 * @namespace src/Service
 * @class TicketService
 * @description Service class for making ticker purchase
 * @author Harsh Patel
 * @license MIT
 */
class TicketService {
  /**
    * @public @method constructor
    * @description Base method when instantiating class
    */
  constructor() {
    this.maxTicketsPerPurchase = 20;
  }

  /**
    * @public @method purchaseTickets
    * @description Check if the purchase request is valid
    * @param {Number} accountId Account Id
    * @param {Array} data Ticket purchase request
    * @return {Object} Reservation details
    */
  purchaseTickets(accountId, data) {
    const ticketRequests = data.map((t) => new TicketRequest(t.type, t.quantity));

    // Validate the purchase request
    this._validatePurchaseRequest(ticketRequests);

    // Calculate the total price
    const totalPrice = this._calculateTotalPrice(ticketRequests);

    // Make a payment request to TicketPaymentService
    const ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId, totalPrice);

    // TODO: Throw an error if payment failed

    // Calculate the number of seats to reserve
    const numSeatsToReserve = this._calculateNumSeatsToReserve(ticketRequests);

    // Make a seat reservation request to SeatReservationService
    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, numSeatsToReserve);

    // TODO: Throw an error if seats reservation failed

    // After events such as sending emails etc

    return {reservationCode: Math.floor(Math.random() * 1000000000)};
  }

  /**
    * @private @method _validatePurchaseRequest
    * @description Check if the purchase request is valid
    * @param {Array} ticketRequests Different type of ticket requests
    */
  _validatePurchaseRequest(ticketRequests) {
    for (const ticketRequest of ticketRequests) {
      const type = ticketRequest.getType();

      // Check if infants are purchased with adults
      if (['Child', 'INFANT'].includes(type) && !ticketRequests.find((t) => t.getType() === 'ADULT')) {
        throw new InvalidPurchaseException('Child and Infant tickets must be purchased with adults');
      }
    }

    // Check if the total number of tickets is within the limit
    const totalNumOfTickets = ticketRequests.reduce((total, t) => total + t.getQuantity(), 0);
    if (totalNumOfTickets > this.maxTicketsPerPurchase) {
      throw new InvalidPurchaseException(`Only a maximum of ${this.maxTicketsPerPurchase} tickets can be purchased at a time`);
    }
  }

  /**
    * @private @method _calculateTotalPrice
    * @description Calculate total price for the ticket requests
    * @param {Array} ticketRequests Different type of ticket requests
    * @return {Number} Total price for the ticket requests
    */
  _calculateTotalPrice(ticketRequests) {
    let totalPrice = 0;

    for (const ticketRequest of ticketRequests) {
      const type = ticketRequest.getType();
      const quantity = ticketRequest.getQuantity();

      const ticketPrice = ticketPrices[type];
      totalPrice += ticketPrice * quantity; // TODO: is the price inc or ex vat?
    }

    return totalPrice;
  }

  /**
    * @private @method _calculateNumSeatsToReserve
    * @description Calculate total number of seats to reserve
    * @param {Array} ticketRequests Different type of ticket requests
    * @return {Number} total number of seats to reserve
    */
  _calculateNumSeatsToReserve(ticketRequests) {
    const numAdults = ticketRequests.find((tr) => tr.getType() === 'ADULT').getQuantity();
    const numChildren = ticketRequests.find((tr) => tr.getType() === 'CHILD')?.getQuantity() || 0;

    return numAdults + numChildren;
  }
}

module.exports = TicketService;
