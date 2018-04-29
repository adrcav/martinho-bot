const Message = require('./models/message.model');

module.exports = {
    addNewMessage: addNewMessage,
    getMessage: getMessage,
    transformMessage: transformMessage,
    showMessages: showMessages,
    deleteOldMessages: deleteOldMessages
};

function transformMessage(args) {
    let str = args.join(' ').split('=');
    return [
        str[0].toLowerCase().trim(),
        str[1].trim()
    ];
}

function addNewMessage(args, guidId) {
    return new Promise( function(resolve, reject) {
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

function showMessages(args, guildId) {
    return new Promise( function(resolve, reject) {
        if (args.length !== 1) return reject('Invalid arguments');

        Message.find({
            guildId: guildId
        })
        .select('message trigger')
        .sort('-createdAt')
        .exec((err, message) => {
            if (err) reject(err);
            //console.log(message);
            resolve(message);
        });
    });
}

function getMessage(trigger, guildId) {
    return new Promise( function(resolve, reject) {
        Message.findOne({
            guildId: guildId,
            trigger: trigger
        })
        .select('message')
        .sort('-createdAt')
        .exec((err, message) => {
            if (err) reject(err);
            //console.log(message);
            resolve(message);
        });
    });
}

function deleteOldMessages(trigger, guildId) {
    return new Promise( function(resolve, reject) {
        Message.findOneAndRemove({
            guildId: guildId,
            trigger: trigger
        })
        .exec((err, success) => {
            if (err) reject(err);
            //console.log(success);
            resolve(success);
        });
    });
}