const CronJob = require('cron').CronJob;

const paths = require(__dirname + '/../config/paths.json');
const schedules = require(__dirname + '/../config/schedules.json');
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

function scheduleMeme(schedule, targetChannel) {
    var cronTime = `${schedule.second} ${schedule.minute} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`

    var job = new CronJob(cronTime, () => {
        const channel = bot.channels.cache.find(channel => channel.name === targetChannel);
        sendMeme(channel);
    });

    job.start();
}

config = reload(paths, schedules);

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

listener.on(listener.REQUEST_MEME, sendMeme)

module.exports = reload;