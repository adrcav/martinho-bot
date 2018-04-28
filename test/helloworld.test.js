const chai = require('chai');
const assert = chai.assert;

const controller = require('../controller.js');

describe('Hello World Test', () => {
    it('Should say hello world', () => {
        helloWorld = controller.helloWorld();
        assert.equal(helloWorld, 'Hello World');
    })
});