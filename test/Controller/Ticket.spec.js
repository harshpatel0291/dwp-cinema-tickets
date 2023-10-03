const assert = require('assert');
const request = require('supertest');

/**
 * @namespace test/Controller
 * @test Ticket
 * @description Endpoint test
 * @author Harsh Patel
 * @license MIT
 */
describe('Controller Endpoint Test [/Ticket]', () => {
  describe('POST', () => {
    it('Should return 404, invalid route', (done) => {
      request(process.env.SERVER)
          .post('/tickett')
          .send()
          .set({'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': process.env.ORIGIN})
          .end(function(err, res) {
            // check status with message
            assert.strictEqual(res.statusCode, 404);
            assert.ok(res.body);

            // finish
            setTimeout(() => done(), 50);
          });
    });

    it('Should return 422, unprocessable entity', (done) => {
      request(process.env.SERVER)
          .post('/ticket')
          .send({accountId: 1, tickets: [{type: 'UNKNOWN', quantity: 21}]})
          .set({'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': process.env.ORIGIN})
          .end(function(err, res) {
            // check status with message
            assert.strictEqual(res.statusCode, 422);
            assert.ok(res.body);

            // finish
            setTimeout(() => done(), 50);
          });
    });

    it('Should return 400, bad Request', (done) => {
      request(process.env.SERVER)
          .post('/ticket')
          .send({accountId: 1, tickets: [{type: 'CHILD', quantity: 1}, {type: 'INFANT', quantity: 1}]})
          .set({'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': process.env.ORIGIN})
          .end(function(err, res) {
            // check status with message
            assert.strictEqual(res.statusCode, 400);
            assert.strictEqual(res.body.message, 'Child and Infant tickets must be purchased with adults');

            // finish
            setTimeout(() => done(), 50);
          });
    });

    it('Should return 400, bad Request', (done) => {
      request(process.env.SERVER)
          .post('/ticket')
          .send({accountId: 1, tickets: [{type: 'ADULT', quantity: 10}, {type: 'CHILD', quantity: 10}, {type: 'INFANT', quantity: 1}]})
          .set({'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': process.env.ORIGIN})
          .end(function(err, res) {
            // check status with message
            assert.strictEqual(res.statusCode, 400);
            assert.strictEqual(res.body.message, 'Only a maximum of 20 tickets can be purchased at a time');

            // finish
            setTimeout(() => done(), 50);
          });
    });

    it('Should return 200, with reservationCode', (done) => {
      request(process.env.SERVER)
          .post('/ticket')
          .send({accountId: 1, tickets: [{type: 'ADULT', quantity: 10}, {type: 'CHILD', quantity: 5}, {type: 'INFANT', quantity: 5}]})
          .set({'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': process.env.ORIGIN})
          .end(function(err, res) {
            // check status with message
            assert.strictEqual(res.statusCode, 200);
            assert.ok(res.body.reservationCode);
            assert.ok(typeof res.body.reservationCode === 'number');

            // finish
            setTimeout(() => done(), 50);
          });
    });
  });
});
