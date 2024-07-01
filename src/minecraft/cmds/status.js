const { send } = require('../chat.js');

module.exports = {
    type: 'officer',
    command: '.',

    async execute(bot, args) {
        console.log(args[0])
        if (args[0] === "on")
        {   
            send(bot, '/status online')
            setTimeout(() => {
                send(bot, '/oc Status has been set to: Online!');
            }, 500);
        }
        if (args[0] === 'off') 
        {
            send(bot, '/status offline');
            setTimeout(() => {
                send(bot, '/oc Status has been set to: Offline!');
            }, 500);
        }
    },
};
