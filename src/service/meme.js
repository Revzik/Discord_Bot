// theese functions are used to send meme replies to the channels
// and send a scheduled meme based on crontab
const CronJob = require('cron').CronJob;

const TZ = process.env.TZ;
const paths = require('@conf/bot/paths.json');
const schedules = require('@conf/bot/schedules.json');
const listener = require('@handler/command');
const { loadRandom } = require('@data/image');
const bot = require('@src/bot');
const logger = require('@log/logger').createLogger(__filename);

function reload(paths, schedules) {
    logger.info('Loading meme service...');
    config = {
        path: __dirname + '/../../' + paths['memeDir'],
        schedule: schedules['memeTime'],
        scheduleChannel: schedules['memeChannel']
    }
    logger.info('Successfully loaded meme service!');

    scheduleMeme(config.schedule, config.scheduleChannel);

    return config;
}

// crontab scheduler
function scheduleMeme(schedule, targetChannel) {
    logger.debug(`Scheduling meme to send: ${JSON.stringify(schedule)}`);
    var cronTime = `${schedule.second} ${schedule.minute} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`

    var job = new CronJob(cronTime, () => {
        const channel = bot.channels.cache.find(channel => channel.name === targetChannel);
        sendMeme(channel);
    }, timeZone=TZ);

    job.start();

    logger.info(`Next meme will be sent at: ${job.nextDate()}`);
}

// main functions - for now just from a local directory
function sendMeme(channel) {
    logger.debug('No online sources, sending local meme');
    sendMemeLocal(channel);
}

function sendMemeLocal(channel) {
    image = loadRandom(config.path);

    channel.send({
        files: [{
            attachment: image.path,
            name: image.name
        }]
    });
}

// setup the modules
config = reload(paths, schedules);

listener.on(listener.REQUEST_MEME, sendMeme)

module.exports = reload;
