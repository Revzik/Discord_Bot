require('dotenv').config();
const Discord = require('discord.js');

const CommandHandler = require('./handlers/command');
const ReplyService = require('./services/reply');
const MemeService = require('./services/meme');

var config = require(__dirname + '/config/command.json');

const TOKEN = process.env.TOKEN;

var bot = new Discord.Client();
bot.login(TOKEN);

var commandHandler = new CommandHandler(config);
var replyService = new ReplyService(config, commandHandler);
var memeService = new MemeService(config, commandHandler);

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandHandler.processMessage(msg);
});