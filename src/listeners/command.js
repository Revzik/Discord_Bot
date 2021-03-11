'use strict';

const Emmiter = require('events');

class CommandListener extends Emmiter {

    constructor(config) {
        super();

        this.reload(config);

        const REPLY = 'reply';
    }
    
    reload(config) {
        this.prefix = config.prefix.toLowerCase();
    }

    processMessage(message) {
        var command = this.filter(message);
        if (command === null) {
            return;
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
}

module.exports = CommandListener;