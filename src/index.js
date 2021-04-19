// application initialization and config
var bot = require('@src/bot');

// logging configuration
const logger = require('@log/logger').createLogger(__filename);
logger.info('Starting bot...');

// setup services
logger.info('Configuring services...');
const commandHandler = require('@handler/command');
require('@service/reply');
require('@service//meme');
logger.info('Succesfully configured services!');

// setup bot and its listeners
const TOKEN = process.env.TOKEN;
logger.info('Logging in...');
bot.login(TOKEN);

bot.once('ready', () => {
    logger.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandHandler.processMessage(msg);
});
