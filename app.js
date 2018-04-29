/* 
 * Martinho Bot
 * Authors: Adriel Cavalcanti <adrcav>, Ítalo Sousa <italosa>
 * 2018
*/

const Discord = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config.json');
const controller = require('./controller.js');

// Mongo connect
mongoose.connect("mongodb://martinhodb:martinho147@martinhobot-shard-00-00-cus2j.mongodb.net:27017,martinhobot-shard-00-01-cus2j.mongodb.net:27017,martinhobot-shard-00-02-cus2j.mongodb.net:27017/test?ssl=true&replicaSet=MartinhoBot-shard-0&authSource=admin");

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
});
// End of Mongo connect

const client = new Discord.Client();

// Server messages
client.on('ready', () => {
    console.log('Martinho Bot has started! :)');
    console.log('Users: ' + client.users.size + ' | Guilds: ' + client.guilds.size);
    client.user.setActivity('Ajudando ' + client.users.size + ' pessoas! :)');
});

client.on('guildCreate', guild => {
    console.log('New guild joined: ' + guild.name + '(Users: ' + guild.memberCount + ', ID: '+ guild.id + ')');
    client.user.setActivity('Ajudando ' + client.users.size + ' pessoas! :)');
});

client.on('guildDelete', guild => {
    console.log('Guild deleted: ' + guild.name + '(ID: + ' + guild.id + ')');
    client.user.setActivity('Ajudando ' + client.users.size + 'pessoas! :)');
});

// Users messages
client.on('message', async message => {
    if (message.author.bot) return;

    const guildId = message.channel.guild.id;

    if (message.content.indexOf(config.prefix) === 0) {
        const args = message.content.slice(config.prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();
    
        if (command === 'ping') {
            const m = await message.channel.send('Pera aê, mano...');
            m.edit('Pong! Latência: ' + Math.round(client.ping) + 'ms.');
        }
    
        if (command === 'add') {
            // add function
        }
    
        if (command === 'show') {
            // show function
        }
    }

    // trigger function (mongo)
});

client.login(config.token);