"use strict";

const CH_CONFIG = __dirname + "/command_config.json";
const REPLY_GENERIC = "generic";

var config = require(CH_CONFIG);

class CommandHandler {

    constructor() {
        this.prefix = config.prefix.toLowerCase();
        this.genericReplies = config.genericReplies;
    }
    
    reload() {
        config = require(CH_CONFIG);

        this.prefix = config.prefix.toLowerCase();
        this.genericReplies = config.genericReplies;
    }

    filter(msg) {
        if (msg.author.bot || !msg.content.trim().startsWith(this.prefix)) {
            return null;
        }
        
        const commandBody = msg.content.toLowerCase().slice(this.prefix.length).trim();
        const args = commandBody.split(" ");
        const command = args.shift();

        return { command: command, args: args };
    }

    processMessage(msg) {
        var cmd = this.filter(msg);
        if (cmd === null) {
            return;
        }

        this.reply(msg, REPLY_GENERIC);
    }

    reply(msg, type) {
        if (type === REPLY_GENERIC) {
            msg.channel.send(this.genericReplies[Math.floor(Math.random() * this.genericReplies.length)]);
        }
    }
}

module.exports = new CommandHandler();