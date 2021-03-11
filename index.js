require('dotenv').config();

const TOKEN = process.env.TOKEN;

const Discord = require('discord.js');
var bot = new Discord.Client();
bot.login(TOKEN);

var commandHandler = require('./command_handler');

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandHandler.processMessage(msg);
});