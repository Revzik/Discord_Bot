const fs = require('fs');
const logger = require(__dirname + '/../config/log/logger.js').createLogger(__filename);

// Loads a random image from a given directory
function loadRandom(path) {
    logger.debug('Loading image from disk');
    
    files = fs.readdirSync(path);
    image = files[Math.floor(Math.random() * files.length)];
    exts = image.split('.');
    
    logger.debug(`Loaded image: ${image}`);
    return {
        path: path + '/' + image,
        name: image,
        ext: exts[exts.length - 1]
    };
}

module.exports = { loadRandom };