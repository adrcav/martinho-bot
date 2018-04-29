/* 
 * Martinho Bot
 * Authors: Adriel Cavalcanti <adrcav>, Ítalo Sousa <italosa>
 * 2018
*/

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const controller = require('./controller.js');

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

});

client.login(config.token);