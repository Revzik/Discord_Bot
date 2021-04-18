// this module is used to handle generic and non-command messages sent to the bot
const UNKNOWN = 'unknown';
const GENERIC = 'generic';
const POSITIVE = 'positive';
const NEUTRAL = 'neutral';
const NEGATIVE = 'negative';
const CHOIE = 'choice';
const WHERE = 'where';

const config = require(__dirname + '/../config/bot/command.json');
const listener = require(__dirname + '/../handlers/command');
const logger = require(__dirname + '/../config/log/logger.js').createLogger(__filename);

function reload(config) {
    logger.info('Loading reply service...');
    var replies = {};

    for (const [key, value] of Object.entries(config.replies)) {
        replies[key] = value;
    }

    logger.info('Successfully loaded reply service!');
    return replies;
}

// function to reply to non-command messages
function reply(channel, question) {
    if (question[0] === '') {
        logger.debug("No message content, sending unknown");
        sendMessage(channel, UNKNOWN);
    } else if (isYesNo(question)) {
        logger.debug("Yes/no question detected, sending response");
        var answer = Math.floor(Math.random() * 3);
        if (answer === 0) {
            sendMessage(channel, POSITIVE);
        } else if (answer === 1) {
            sendMessage(channel, NEUTRAL);
        } else {
            sendMessage(channel, NEGATIVE);
        }
    } else if (isChoiceQuestion(question)) {
        logger.debug("Choice question detected, sending response");
        sendMessage(channel, CHOIE);
    } else if (isWhereQuestion(question)) {
        logger.debug("Place question detected, sending response");
        sendMessage(channel, WHERE);
    } else {
        logger.debug("Generic question detected, sending response");
        sendMessage(channel, GENERIC);
    }
}

// helper functions
function isYesNo(question) {
    return (question[0] === 'czy' || 
            (question[1] === 'czy' &&
            (question[0] === 'a' || question[0] === 'wiesz')) &&
            !question.includes('czy', 2));
}

function isChoiceQuestion(question) {
    return question.includes('czy', 1);
}

function isWhereQuestion(question) {
    return question[0] === 'gdzie' || 
            (question[1] === 'gdzie' &&
            (question[0] === 'a' || question[0] === 'wiesz'));
}

function sendMessage(channel, type) {
    channel.send(replies[type][Math.floor(Math.random() * replies[type].length)]);
}

// setup the module
var replies = reload(config);

listener.on(listener.REPLY, reply);

module.exports = reload;