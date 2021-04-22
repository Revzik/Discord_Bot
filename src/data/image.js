const fs = require('fs');
const logger = require('@log/logger').createLogger(__filename);

// Loads a random image from a given directory
function loadRandom(path) {
    logger.debug('Loading image from disk');
    
    files = fs.readdirSync(path);
    if (files.length === 0) {
        throw new Error("No images in local directory!");
    }

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
