const fs = require('fs');

// Loads a random image from a given directory
function loadRandom(path) {
    files = fs.readdirSync(path);
    return files[Math.floor(Math.random() * files.length)];
}

module.exports = { loadRandom };