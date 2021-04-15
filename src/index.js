// application initialization and config
// logging configuration
const loggerConfig = require(__dirname + '/config/log/winston.json');

// setup services
const commandHandler = require(__dirname + '/handlers/command');
require(__dirname + '/services/reply');
require(__dirname + '/services/meme');

// setup bot token
const TOKEN = process.env.TOKEN;
require('dotenv').config();

// setup bot and its listeners
var bot = require(__dirname + '/bot');
bot.login(TOKEN);

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandHandler.processMessage(msg);
});
