/* 
 * Martinho Bot
 * Authors: Adriel Cavalcanti <adrcav>, Ítalo Sousa <italosa>
 * 2018
*/

const Discord = require('discord.js');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config.json');
const controller = require('./controller.js');

const app = express();
const port = process.env.PORT || 8080

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
    client.user.setActivity('Conhecendo ' + client.users.size + ' pessoas! :)');
});

client.on('guildCreate', guild => {
    console.log('New guild joined: ' + guild.name + ' (Users: ' + guild.memberCount + ', ID: '+ guild.id + ')');
    client.user.setActivity('Conhecendo ' + client.users.size + ' pessoas! :)');
});

client.on('guildDelete', guild => {
    console.log('Guild deleted: ' + guild.name + ' (ID: ' + guild.id + ')');
    client.user.setActivity('Conhecendo ' + client.users.size + 'pessoas! :)');
});

// Users messages
client.on('message', async message => {
    if (message.author.bot) return;

    const guildId = message.channel.guild.id;

    if (message.content.indexOf(config.prefix) === 0) {
        let args = message.content.slice(config.prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();
    
        if (command === 'ping') {
            const m = await message.channel.send(config.waitingMessage);
            m.edit('Pong! Latência: ' + Math.round(client.ping) + 'ms.');
        }

        if (command === 'help') {
            let res = '\n\n**Meus comandos:** \n';
            
            config.commands.forEach(elem => {
                res += '*$' + elem.cmd + '* - ' + elem.desc + '\n';
            });

            return message.reply(res);
        }

        if (command === 'say') {
            let msg = args.join(' ');
            message.delete().catch(err => {
                console.log('Say Error: ' + err);
            });
            message.channel.send(msg, { tts: true });
        }
    
        if (command === 'add') {
            let msg = controller.transformMessage(args);
            const m = await message.channel.send(config.waitingMessage);        
            controller.deleteOldMessages(msg[0], guildId)
                .then(() => {
                    controller.addNewMessage(msg, guildId)
                        .then(res => {
                            //console.log(res);
                            message.delete().catch(err => {
                                console.log('Delete error: ' + err);
                            });
                            // select a random success message
                            let coolMessage = config.successMessages[controller.getRandomNumber(0, config.successMessages.length)];
                            m.edit(coolMessage);
                        })
                        .catch(err => {
                            console.log(err);
                            m.edit('Não deu pra adicionar, parça. Foi mal :cry: :cry:');                
                        });
                })
                .catch(err => {
                    console.log(err);
                    m.edit('Não deu pra adicionar, parça. Foi mal :cry: :cry:');  
                });
        }
    
        if (command === 'show') {
            const m = await message.channel.send(config.waitingMessage);
            if (message.member.hasPermission('KICK_MEMBERS')) {
                controller.showMessages(guildId)
                    .then(res => {
                        let commands = 'Mensagens aprendidas em **' + message.guild.name + '**:\n';
                        res.forEach(elem => {
                            commands += '**' + elem.trigger + '** => ' + elem.message + '\n';
                        });
                        //console.log(commands);
                        m.edit('Checa a DM, brother! :call_me:');
                        message.author.send(commands);
                    })
                    .catch(err => {
                        console.log(err);
                        m.edit('Não consegui encontrar as mensagens, sorry :cry: :confused:');
                    });
            } else {
                m.edit('Pô, mano, vc não tem permissão pra esse comando. :frowning2: :cry:');
            }
        }
    }

    if (typeof(message.content) === 'string') {
        let msg = message.content.toLowerCase().trim();
        controller.getMessage(msg, guildId)
            .then(res => {
                message.reply(res.message);
            }).catch(err => {
                //console.log('Trigger not found');
            });
    }
    
});

app.listen(port, function() {
    console.log('Our app is running on port: ' + port);
});

app.get('/', (req, res) => {
    res.send(200);
});

client.login(config.token);