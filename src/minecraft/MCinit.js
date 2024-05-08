const mineflayer = require('mineflayer');
const { logsChannel } = require('../../config.json');
const { ign } = require('../../auth.json');

class MCinit
{
    constructor(client) {
        this.instance = {
            host: 'mc.hypixel.net',
            username: ign,
            auth: 'microsoft',
            version: "1.8.9",
            viewDistance: "tiny",
            chatLengthLimit: 256
        };
        this.bot = mineflayer.createBot(this.instance);
        this.client = client;
    }

    login() {
        this.bot.on('login', () => {
            let botSocket = this.bot._client.socket;
            console.log(`${this.instance.username} has joined ${botSocket.server ? botSocket.server : botSocket._host}.`);
            this.bot.chat('/w CatboyDark meow');
        });

        this.bot.on('kicked', (reason) => { console.log(`Kicked: ${reason}`); });

        this.bot.on("error", console.log);

        this.bot.on('end', () => { 
            console.log(`${this.instance.username} has disconnected.`);
        });

        this.bot.on('message', message => {
            let content = message.toString().trim();
            if (content.length < 1) { return; }
            let channel = this.client.channels.cache.get(logsChannel);
            channel.send(`${content}`);
        });

        this.client.on('messageCreate', message => {
            let channel = this.client.channels.cache.get(logsChannel);
            if (message.channel.id === channel) {
                let content = message.content;
                this.bot.chat(content);
            }
        });
    }
}

module.exports = MCinit;