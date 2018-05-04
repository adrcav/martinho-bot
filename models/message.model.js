const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    trigger: { type: String, required: true },
    message: { type: String, required: true },
    guildId: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);