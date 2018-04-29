const chai = require('chai');
const assert = chai.assert;

// const databaseService = require('../database.service.js');
const controller = require('../controller.js');

const args = [
    "test",
    "This is an unit test"
];

const guildId = "guild test";

describe('Controller - Insert a message in mongoDb', function() {
    it('Should insert a new message in mongoDb', function() {
        // var messageId = await databaseService.addNewMessage(args);
        // assert.typeOf(messageId, 'string');
        console.log('test');
        controller.addNewMessage(args, guildId)
            .then(function(res) {
                console.log(res);
                assert.equal(res, '1232');
            })
            .catch(function(err) {
                console.log('falseee');
            });
    });
});