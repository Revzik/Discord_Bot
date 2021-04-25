// helper functions
function getRandom(array) {
    if (!Array.isArray(array)) {
        throw new Error(`Parameter given is not an array: ${JSON.stringify(array)}`)
    }
    if (array.length === 0) {
        throw new Error('Array cannot be empty!')
    }
    if (array.length === 1) {
        return array[0]
    }
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = { getRandom }