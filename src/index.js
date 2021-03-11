require('dotenv').config();

const TOKEN = process.env.TOKEN;

const Discord = require('discord.js');
var bot = new Discord.Client();
bot.login(TOKEN);

var config = require(__dirname + '/config/command.json');
const CommandListener = require('./listeners/command');
var commandListener = new CommandListener(config);

const ReplyService = require('./services/reply');
var replyService = new ReplyService(config, commandListener);

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandListener.processMessage(msg);
});