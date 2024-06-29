const { send } = require('../chat.js');

module.exports = (bot) => 
{
    bot.on('message', (message) => 
    {
        const text = message.toString().trim();

        if (text.includes('has requested to join the Guild!')) 
        {
            send(bot, '/oc Join request detected!');
        }
    });
};
