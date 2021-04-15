// application initialization and config
var bot = require(__dirname + '/bot');

// logging configuration
const logger = require(__dirname + '/config/log/logger.js').createLogger(__filename);
logger.info('Starting bot...');

// setup services
logger.info('Configuring services...');
const commandHandler = require(__dirname + '/handlers/command');
require(__dirname + '/services/reply');
require(__dirname + '/services/meme');
logger.info('Succesfully configured services!');

// setup bot token
const TOKEN = process.env.TOKEN;
require('dotenv').config();

// setup bot and its listeners
logger.info('Logging in...');
bot.login(TOKEN);

bot.once('ready', () => {
    logger.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandHandler.processMessage(msg);
});
