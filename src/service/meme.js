// theese functions are used to send meme replies to the channels
// and send a scheduled meme based on crontab
const CronJob = require('cron').CronJob
const gis = require('g-i-s')

const TZ = process.env.TZ
const SUPPORTED_FORMATS = /\.jpg$|\.jpeg$|\.png$|\.webp$|\.gif$/
const UNSUPPORTED_DOMAINS = ['preview\.redd\.it']

const memeConfig = require('@conf/bot/meme.json')
const messages = require('@conf/bot/messages.json')
const listener = require('@handler/command')
const { loadRandom } = require('@data/image')
const bot = require('@src/bot')
const { getRandom } = require('@util/utils')
const logger = require('@log/logger').createLogger(__filename)

function reload(memeConfig, messages) {
    logger.info('Loading meme service...')
    config = {
        path: __dirname + '/../../' + memeConfig['localPath'],
        keys: memeConfig['keys'],
        schedule: memeConfig['time'],
        scheduleChannel: memeConfig['channel'],
        noImageMessages: messages.noImage
    }
    logger.info('Successfully loaded meme service!')

    scheduleMeme(config.schedule, config.scheduleChannel)

    return config
}

// crontab scheduler
function scheduleMeme(schedule, targetChannel) {
    logger.debug(`Scheduling meme to send: ${JSON.stringify(schedule)}`)
    var cronTime = `${schedule.second} ${schedule.minute} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`

    var job = new CronJob(cronTime, () => {
        const channel = bot.channels.cache.find(channel => channel.name === targetChannel)
        sendMeme(channel)
    }, timeZone=TZ)

    job.start()

    logger.info(`Next meme will be sent at: ${job.nextDate()}`)
}

// main function - deals with 
async function sendMeme(channel) {
    logger.debug('Looking for memes to send')
    try {
        let url = await getMemeWeb(config.keys)
        logger.info('Sending remote image')
        sendMemeWeb(url, channel)
    } catch (error) {
        logger.error('Could not find images online!')
        logger.error(error)
        try {
            let imageFile = await getMemeLocal(config.path)
            logger.info('Sending local image')
            sendMemeLocal(imageFile, channel)
        } catch (error) {
            logger.error('Could not send any images!')
            logger.error(error)
            sendNoImageMessage(channel)
        }
    }
}

// functions used to search for memes using google image search and filter results
function getMemeWeb(keys) {
    logger.debug(`Fetching random meme from web using keys: ${keys}`)
    return new Promise((resolve, reject) => {
        let opts = {
            searchTerm: getRandom(keys),
            queryStringAddition: '&tbs=qdr:w',
            filterOutDomains: UNSUPPORTED_DOMAINS
        }
        gis(opts, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(getRandom(filterResults(results)))
            }
        })
    })
}

function filterResults(searchResults) {
    return searchResults
    .slice(0, 20)
    .map(entry => {
        return entry.url.split('?')[0]
    })
    .filter(url => {
        return SUPPORTED_FORMATS.test(url)
    })
}

function sendMemeWeb(url, channel) {
    logger.debug(`Sending meme from ${url}`)
    channel.send({
        files: [url]
    })
}

// functions used to load backup memes from local directory
function getMemeLocal(path) {
    logger.debug(`Loading random image from: ${path}`)
    return new Promise((resolve, reject) => {
        var image = loadRandom(path)
        if (image !== undefined) {
            resolve(image)
        } else {
            reject('Could not find any images locally')
        }
    })
}

function sendMemeLocal(image, channel) {
    logger.debug(`Sending local meme: ${image}`)
    channel.send({
        files: [{
            attachment: image.path,
            name: image.name
        }]
    })
}

// default text in case all other options fail
function sendNoImageMessage(channel) {
    logger.debug(`Sending random response`)
    channel.send(getRandom(config.noImageMessages))
}

// setup the modules
config = reload(memeConfig, messages)

listener.on(listener.REQUEST_MEME, sendMeme)

module.exports = reload
