/**
 * @namespace test
 * @test index
 * @description test index, for ordering tests
 * @author Harsh Patel
 * @license MIT
 */

process.env.SERVER = 'http://localhost:3000';
process.env.ORIGIN = 'http://localhost';

// Endpoint Tests

require('./Controller/Ticket.spec.js');
