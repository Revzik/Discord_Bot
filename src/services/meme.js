const config = require(__dirname + '/../config/paths.json');
const listener = require(__dirname + '/../handlers/command');
const { loadRandom } = require(__dirname + '/../data/image');

function reload(config) {
    return __dirname + '/../../' + config['memeDir'];
}

path = reload(config);

function sendMeme(channel) {
    sendMemeLocal(channel);
}

function sendMemeLocal(channel) {
    image = loadRandom(path);

    channel.send({
        files: [{
            attachment: image.path,
            name: image.name
        }]
    });
}

listener.on(listener.REQUEST_MEME, sendMemeLocal)

module.exports = reload(config);