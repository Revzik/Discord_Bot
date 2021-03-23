const config = require(__dirname + '/../config/paths.json');
const listener = require(__dirname + '/../handlers/command');
const { loadRandom } = require(__dirname + '/../data/image');

function reload(config) {
    return __dirname + '/../../' + config['memeDir'];
}

path = reload(config);

function getMemeLocal(channel) {
    console.log(loadRandom(path));
}

listener.on(listener.REQUEST_MEME, getMemeLocal)

module.exports = reload(config);