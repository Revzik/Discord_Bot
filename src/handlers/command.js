'use strict';

const Emmiter = require('events');

class CommandHandler extends Emmiter {

    constructor(config) {
        super();

        this.reload(config);

        const REPLY = 'reply';
        const REQUEST_MEME = 'meme';
    }
    
    reload(config) {
        this.prefix = config.prefix.toLowerCase();
        this.replies = config.replies;
    }

    processMessage(message) {
        var command = this.filter(message);
        if (command === null) {
            return;
        }
        
        if (this.isRequest(command)) {
            if (this.isMemeRequest(command)) {
                this.emit(this.REQUEST_MEME, message.channel);
            }
        }

        this.emit(this.REPLY, message.channel, command);
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
        return this.requests.includes(command[0]);
    }

    isMemeRequest(command) {
        return this.requests.includes(command[1]);
    }
}

module.exports = CommandHandler;