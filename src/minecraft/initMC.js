const mineflayer = require('mineflayer')
const { catboy } = require('../../auth.json')
const { logsChannel } = require('../../config.json')
const client = require('../discord/initDC')

const mcBot = mineflayer.createBot
({
    host: 'mc.hypixel.net',
    username: catboy,
    auth: 'microsoft',
    version: "1.8.9",
    viewDistance: "tiny",
    chatLengthLimit: 256
})

mcBot.on('login', () => {
    let botSocket = mcBot._client.socket;
    console.log(`${catboy} has joined ${botSocket.server ? botSocket.server : botSocket._host}.`);
    mcBot.chat('/w CatboyDark meow');
})


mcBot.on("kicked", console.log);
mcBot.on("error", console.log);

mcBot.on('end', () => {
    console.log(`${catboy} has disconnected.`)
})
