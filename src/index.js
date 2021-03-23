require('dotenv').config();
const Discord = require('discord.js');

const commandHandler = require('./handlers/command');
require('./services/reply');
require('./services/meme');

const TOKEN = process.env.TOKEN;

var bot = new Discord.Client();
bot.login(TOKEN);

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandHandler.processMessage(msg);
});
