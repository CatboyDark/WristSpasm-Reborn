const { send } = require('../chat.js');

module.exports = (bot) => {
    bot.on('message', (message) => {
        const text = message.toString().trim();

        if (
            text.startsWith('Officer >') &&
            text.includes('is kath a raging homosexual')
        ) {
            send(bot, '/oc no.');
        }
    });
};
