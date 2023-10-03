const {Router} = require('express');
const router = Router({mergeParams: true});

const {bodyValidator} = require('../Middleware/Validator.js');
const ticketValidation = require('../Validation/TicketValidation.js');

const TicketService = require('../Service/TicketService.js');

/**
 * @namespace src/Controller
 * @controller Ticket
 * @extends Controller
 * @description Controller exposing methods over the routed endpoint
 * @author Harsh Patel
 * @license MIT
 */

/**
 * @public @async @method post
 * @description Post (replace) an existing record with this one at this resource
 * @param {*} request The request that caused the controller to run
 * @return {Mixed} Response as a promise or any other data type
 */
router.post('/', bodyValidator(ticketValidation), async (request, res, next) => {
  try {
    const ticketService = new TicketService();
    const data = ticketService.purchaseTickets(request.body.accountId, request.body.tickets); // TODO: Use authenticated user account id

    return res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
