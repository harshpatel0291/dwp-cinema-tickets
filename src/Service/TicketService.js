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

// Define maximum tickets per purchase
const maxTicketsPerPurchase = 20;

/**
 * @namespace src/Service
 * @class TicketService
 * @description Service class for making ticker purchase
 * @author Harsh Patel
 * @license MIT
 */
class TicketService {
  /**
    * @public @method purchaseTickets
    * @description Check if the purchase request is valid
    * @param {Number} accountId Account Id
    * @param {Array} data Ticket purchase request
    * @return {Object} Purchase details
    */
  purchaseTickets(accountId, data) {
    const ticketRequests = data.map((t) => new TicketRequest(t.type, t.quantity));

    // Validate the purchase request
    this._validatePurchaseRequest(ticketRequests);

    // Calculate the total price
    const totalCost = this._calculateTotalCost(ticketRequests);

    // Make a payment request to TicketPaymentService
    const ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId, totalCost);

    // TODO: Throw an error if payment failed

    // Calculate the number of seats to reserve
    const numSeatsToReserve = this._calculateNumSeatsToReserve(ticketRequests);

    // Make a seat reservation request to SeatReservationService
    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, numSeatsToReserve);

    // TODO: Throw an error if seats reservation failed

    // After events such as sending emails etc

    return {
      reference: Math.floor(Math.random() * 1000000000),
      numSeatsToReserve,
      totalCost
    };
  }

  /**
    * @private @method _validatePurchaseRequest
    * @description Check if the purchase request is valid
    * @param {Array} ticketRequests Different type of ticket requests
    */
  _validatePurchaseRequest(ticketRequests) {
    for (const ticketRequest of ticketRequests) {
      const type = ticketRequest.getType();
      const qyantity = ticketRequest.getQuantity();

      // Check if child and infant are purchased with adults
      if (['Child', 'INFANT'].includes(type) && !ticketRequests.find((t) => t.getType() === 'ADULT')) {
        throw new InvalidPurchaseException('Child and Infant tickets must be purchased with adults');
      }

      // Check if infant quantity is not greater than adults
      if (type === 'INFANT' && qyantity > ticketRequests.find((t) => t.getType() === 'ADULT').getQuantity()) {
        throw new InvalidPurchaseException('Infant ticket quantity cannot be greater than adults');
      }
    }

    // Check if the total number of tickets is within the limit
    const totalNumOfTickets = ticketRequests.reduce((total, t) => total + t.getQuantity(), 0);
    if (totalNumOfTickets > maxTicketsPerPurchase) {
      throw new InvalidPurchaseException(`Only a maximum of ${maxTicketsPerPurchase} tickets can be purchased at a time`);
    }
  }

  /**
    * @private @method _calculateTotalCost
    * @description Calculate total cost for the ticket requests
    * @param {Array} ticketRequests Different type of ticket requests
    * @return {Number} Total cost for the ticket requests
    */
  _calculateTotalCost(ticketRequests) {
    return ticketRequests.reduce((totalCost, request) => {
      const ticketPrice = ticketPrices[request.getType()]; // TODO: is this price inc or ex vat?
      return totalCost + ticketPrice * request.getQuantity();
    }, 0);
  }

  /**
    * @private @method _calculateNumSeatsToReserve
    * @description Calculate the number of seats to reserve (excluding infants)
    * @param {Array} ticketRequests Different type of ticket requests
    * @return {Number} total number of seats to reserve
    */
  _calculateNumSeatsToReserve(ticketRequests) {
    return ticketRequests.reduce((totalSeats, request) => {
      if (request.getType() !== 'INFANT') {
        return totalSeats + request.getQuantity();
      }
      return totalSeats;
    }, 0);
  }
}

module.exports = TicketService;
