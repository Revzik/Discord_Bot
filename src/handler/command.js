// this file contains the heart of the bot which is CommandHandler
// it acts as a message broker and based on the message body
// it sends an appriopriate response async
const Emmiter = require('events');
const config = require('@conf/bot/command.json');
const logger = require('@log/logger').createLogger(__filename);

// main class to deal with incomming messages
class CommandHandler extends Emmiter {
    
    constructor(config) {
        super();

        this.reload(config);

        this.REPLY = 'reply';
        this.REQUEST_MEME = 'meme';
    }
    
    reload(config) {
        logger.info('Loading commands...');
        this.prefix = config.prefix.toLowerCase();
        this.replies = config.replies;
        this.requests = config.requests;
        logger.info('Successfully loaded commands!');
    }

    // main function which filters out the messages which are not commands
    // and sends apriopriate response
    processMessage(message) {
        var command = this.filter(message);
        if (command === null) {
            return;
        }
      
        if (this.isRequest(command) && this.isMemeRequest(command)) {
            logger.info(`Message "${command}" received, sending meme`);
            this.emit(this.REQUEST_MEME, message.channel);
        } else {
            logger.info(`Message "${command}" received, sending generic response`);
            this.emit(this.REPLY, message.channel, command);
        }
    }

    // filter the messages which don't begin with bot prefix
    filter(message) {
        var content = message.content.toLowerCase().trim();
        if (message.author.bot || !content.startsWith(this.prefix)) {
            return null;
        }
        
        const commandBody = content.slice(this.prefix.length).trim();
        const command = commandBody.split(' ');

        return command;
    }

    // helper methods
    isRequest(command) {
        return this.requests['base'].includes(command[0]);
    }

    isMemeRequest(command) {
        return this.requests['meme'].includes(command[1]);
    }
}

module.exports = new CommandHandler(config);
