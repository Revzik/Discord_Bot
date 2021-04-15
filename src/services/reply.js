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

function reload(config) {
    var replies = {};

    for (const [key, value] of Object.entries(config.replies)) {
        replies[key] = value;
    }

    return replies;
}

// function to reply to non-command messages
function reply(channel, question) {
    if (question[0] === '') {
        sendMessage(channel, UNKNOWN);
    } else if (isYesNo(question)) {
        var answer = Math.floor(Math.random() * 3);
        if (answer === 0) {
            sendMessage(channel, POSITIVE);
        } else if (answer === 1) {
            sendMessage(channel, NEUTRAL);
        } else {
            sendMessage(channel, NEGATIVE);
        }
    } else if (isChoiceQuestion(question)) {
        sendMessage(channel, CHOIE);
    } else if (isWhereQuestion(question)) {
        sendMessage(channel, WHERE);
    } else {
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