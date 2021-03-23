require('dotenv').config();

var bot = require('./bot');

const commandHandler = require('./handlers/command');
require('./services/reply');
require('./services/meme');

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    commandHandler.processMessage(msg);
});
