// theese functions are used to send meme replies to the channels
// and send a scheduled meme based on crontab
const CronJob = require('cron').CronJob;

const paths = require(__dirname + '/../config/bot/paths.json');
const schedules = require(__dirname + '/../config/bot/schedules.json');
const listener = require(__dirname + '/../handlers/command');
const { loadRandom } = require(__dirname + '/../data/image');
const bot = require(__dirname + '/../bot');

function reload(paths, schedules) {
    config = {
        path: __dirname + '/../../' + paths['memeDir'],
        schedule: schedules['memeTime'],
        scheduleChannel: schedules["memeChannel"]
    }

    scheduleMeme(config.schedule, config.scheduleChannel);

    return config;
}

// crontab scheduler
function scheduleMeme(schedule, targetChannel) {
    var cronTime = `${schedule.second} ${schedule.minute} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`

    var job = new CronJob(cronTime, () => {
        const channel = bot.channels.cache.find(channel => channel.name === targetChannel);
        sendMeme(channel);
    });

    job.start();
}

// main functions - for now just from a local directory
function sendMeme(channel) {
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