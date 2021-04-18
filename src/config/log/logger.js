// logger config for separate modules
const winston = require('winston');
//const fileLoggerConfig = require(__dirname + '/config/log/winston.json');

function createLogger(namespace) {
    const loggerConfig = {
        'transports': [
            new winston.transports.Console({
                level: 'debug'
            })
        ],
        'format': winston.format.combine(
            winston.format.label({
                label: namespace
            }),
            winston.format.timestamp(),
            winston.format.printf((info) => {
                return `${info.timestamp} - [${info.level}]:${info.label}: ${info.message}`;
            })
        )
    };
    
    return winston.createLogger(loggerConfig);
}

module.exports = { createLogger };