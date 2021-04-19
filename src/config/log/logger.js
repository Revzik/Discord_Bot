// logger config for separate modules
const winston = require('winston');
require('winston-daily-rotate-file');
//const fileLoggerConfig = require(__dirname + '/config/log/winston.json');

const LOG_DIR = __dirname + '../../../../logs';

const TZ = process.env.TZ;
const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: TZ
    });
}

function createLogger(namespace) {
    const loggerConfig = {
        transports: [
            new winston.transports.Console({
                level: 'debug'
            }),
            new winston.transports.DailyRotateFile({
                filename: 'bot-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                dirname: LOG_DIR,
                createSymlink: true,
                symlinkName: 'bot.log'
            })
        ],
        format: winston.format.combine(
            winston.format.label({
                label: namespace
            }),
            winston.format.timestamp({ format: timezoned }),
            winston.format.printf((info) => {
                return `${info.timestamp} - [${info.level}]:${info.label}: ${info.message}`;
            })
        )
    };
    
    return winston.createLogger(loggerConfig);
}

module.exports = { createLogger };
