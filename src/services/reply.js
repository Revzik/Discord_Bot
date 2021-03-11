'use strict';

const UNKNOWN = 'unknown';
const GENERIC = 'generic';
const POSITIVE = 'positive';
const NEUTRAL = 'neutral';
const NEGATIVE = 'negative';
const CHOIE = 'choice';
const WHERE = 'where';

class ReplyService {

    constructor(config, listener) {
        this.reload(config);
        this.listener = listener;
        listener.on(listener.REPLY, this.reply.bind(this));
    }

    reload(config) {
        this.replies = {};
        for (const [key, value] of Object.entries(config.replies)) {
            this.replies[key] = value;
        }
    }

    reply(channel, question) {
        if (question[0] === '') {
            this.sendMessage(channel, UNKNOWN);
        } else if (this.isChoiceQuestion(question)) {
            this.sendMessage(channel, CHOIE);
        } else if (this.isYesNo(question)) {
            var answer = Math.floor(Math.random() * 3);
            if (answer === 0) {
                this.sendMessage(channel, POSITIVE);
            } else if (answer === 1) {
                this.sendMessage(channel, NEUTRAL);
            } else {
                this.sendMessage(channel, NEGATIVE);
            }
        } else if (this.isWhereQuestion(question)) {
            this.sendMessage(channel, WHERE);
        } else {
            this.sendMessage(channel, GENERIC);
        }
    }

    isYesNo(question) {
        return (question[0] === 'czy' || 
               (question[1] === 'czy' &&
               (question[0] === 'a' || question[0] === 'wiesz')) &&
               !question.includes('czy', 2));
    }

    isChoiceQuestion(question) {
        return question.includes('czy', 1);
    }

    isWhereQuestion(question) {
        return question[0] === 'gdzie' || 
                (question[1] === 'gdzie' &&
                (question[0] === 'a' || question[0] === 'wiesz'));
    }

    sendMessage(channel, type) {
        channel.send(this.replies[type][Math.floor(Math.random() * this.replies[type].length)]);
    }
}

module.exports = ReplyService;