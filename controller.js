const Message = require('./models/message.model');

module.exports = {
    helloWorld: helloWorld,
    addNewMessage: addNewMessage
};

function helloWorld() {
    return "Hello World";
}

function addNewMessage(args, guidId) {
    return new Promise( function (resolve, reject) {
        if (args.length < 2) return reject('Not enough arguments');

        let messageData = {
            trigger: args[0],
            message: args[1],
            guildId: guidId
        };

        let message = new Message(messageData);
        message.save((err, data) => {
            if (err) {
                console.log(err);
                reject(false);
            } else {
                console.log(data);
                resolve(data);
            }
        });
    });
}