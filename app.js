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
    console.log('New guild joined: ' + guild.name + ' (Users: ' + guild.memberCount + ', ID: '+ guild.id + ')');
    client.user.setActivity('Ajudando ' + client.users.size + ' pessoas! :)');
});

client.on('guildDelete', guild => {
    console.log('Guild deleted: ' + guild.name + ' (ID: ' + guild.id + ')');
    client.user.setActivity('Ajudando ' + client.users.size + 'pessoas! :)');
});

// Users messages
client.on('message', async message => {
    if (message.author.bot) return;

    const guildId = message.channel.guild.id;

    if (message.content.indexOf(config.prefix) === 0) {
        let args = message.content.slice(config.prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();
    
        if (command === 'ping') {
            const m = await message.channel.send('Pera aê, mano... :nerd:');
            m.edit('Pong! Latência: ' + Math.round(client.ping) + 'ms.');
        }

        if (command === 'help') {
            let commands = [
                { cmd: 'ping', desc: 'Retorna o ping do servidor.' },
                { cmd: 'add <palavra> = <resposta>', desc: 'Adiciona uma resposta ao bot.' },
                { cmd: 'help', desc: 'Lista de comandos.' }
            ];

            let res = '\n\n**Meus comandos:** \n';
            commands.forEach(elem => {
                res += '*$' + elem.cmd + '* - ' + elem.desc + '\n';
            });

            return message.reply(res);
        }
    
        if (command === 'add') {
            let msg = controller.transformMessage(args);
            // add function
            const m = await message.channel.send('Pera aê, mano... :nerd:');        
            controller.addNewMessage(msg, guildId)
                .then(res => {
                    //console.log(res);
                    m.edit('Pronto men! Mensagem adicionada :ok_hand: :ok_hand:');
                })
                .catch(err => {
                    //console.log(err);
                    m.edit('Não deu pra adicionar, parça. Foi mal :cry: :cry:');                
                })
        }
    
        if (command === 'show') {
            // show function
        }
    }

    if (typeof(message.content) === 'string') {
        controller.getMessage(message.content, guildId)
            .then(res => {
                message.reply(res.message);
            }).catch(err => {
                //console.log('Trigger not found');
            });
    }
    
});

client.login(config.token);