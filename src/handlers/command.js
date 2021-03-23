'use strict';

const Emmiter = require('events');
const config = require(__dirname + '/../config/command.json');

class CommandHandler extends Emmiter {

    constructor(config) {
        super();

        this.reload(config);

        this.REPLY = 'reply';
        this.REQUEST_MEME = 'meme';
    }
    
    reload(config) {
        this.prefix = config.prefix.toLowerCase();
        this.replies = config.replies;
        this.requests = config.requests;
    }

    processMessage(message) {
        var command = this.filter(message);
        if (command === null) {
            return;
        }
        
        if (this.isRequest(command) && this.isMemeRequest(command)) {
            this.emit(this.REQUEST_MEME, message.channel);
        } else {
            this.emit(this.REPLY, message.channel, command);
        }
    }

    filter(message) {
        var content = message.content.toLowerCase().trim();
        if (message.author.bot || !content.startsWith(this.prefix)) {
            return null;
        }
        
        const commandBody = content.slice(this.prefix.length).trim();
        const command = commandBody.split(" ");

        return command;
    }

    isRequest(command) {
        return this.requests['base'].includes(command[0]);
    }

    isMemeRequest(command) {
        return this.requests['meme'].includes(command[1]);
    }
}

module.exports = new CommandHandler(config);