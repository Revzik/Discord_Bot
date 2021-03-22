'use strict';

class MemeService {

    constructor(config, listener) {
        this.listener = listener;
        listener.on(listener.REQUEST_MEME, this.reply.bind(this));
    }

    reply()
}

module.exports = MemeService;