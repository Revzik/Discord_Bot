const fs = require('fs');

// Loads a random image from a given directory
function loadRandom(path) {
    files = fs.readdirSync(path);
    image = files[Math.floor(Math.random() * files.length)];
    exts = image.split('.');
    return {
        path: path + '/' + image,
        name: image,
        ext: exts[exts.length - 1]
    };
}

module.exports = { loadRandom };