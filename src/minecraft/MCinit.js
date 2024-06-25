const mineflayer = require('mineflayer');
const path = require('path');
const fs = require('fs');
const { ign } = require('../../auth.json');

class MCinit 
{
    constructor(client) {
        this.instance = {
            host: 'mc.hypixel.net',
            username: ign,
            auth: 'microsoft',
            version: '1.8.9',
            viewDistance: 'tiny',
            chatLengthLimit: 256
        };

        this.bot = mineflayer.createBot(this.instance);
        this.client = client;

        // Features

        const fDir = path.join(__dirname, 'features');
        const fFiles = fs.readdirSync(fDir).filter(file => file.endsWith('.js'));

        for (const f of fFiles) {
            const fp = path.join(fDir, f);
            const feature = require(fp);
            if (typeof feature === 'function') { feature(this.bot, this.client); } 
			else { console.error(`Feature at ${fp} is not a function.`);}
        }

        // Logic

        this.Logic = {};
        const lDir = path.join(__dirname, './logic');
        const lFiles = fs.readdirSync(lDir).filter(file => file.endsWith('.js'));

        for (const file of lFiles) {
            const logicModule = require(path.join(lDir, file));
            if (typeof logicModule === 'object' && logicModule !== null) {
                Object.assign(this.Logic, logicModule);
            } else {
                this.Logic[file.replace('.js', '')] = logicModule;
            }
        }
    }

    login() 
	{
        this.bot.on('login', () => 
		{
            const botSocket = this.bot._client.socket;
            console.log(`${this.instance.username} has joined ${botSocket.server ? botSocket.server : botSocket._host}.`);

            this.bot.chat('/w PuppyboyDark meow');

            this.Logic.limbo(this.bot);
        });

        this.bot.on('kicked', (reason) => 
		{
            console.log(`Kicked: ${reason}`);
			console.log('Attempting to reconnect in 10 seconds...');

            setTimeout(() => 
			{
                this.bot = mineflayer.createBot(this.instance);
                this.bot.once('spawn', () => {
                    console.log('Reconnected successfully.');
                });
            }, 10000);
        });

        this.bot.on('error', console.log);

        this.bot.on('end', () => {
            console.log(`${this.instance.username} has disconnected.`);
			console.log('Attempting to reconnect in 10 seconds...');

            setTimeout(() => 
			{
                this.bot = mineflayer.createBot(this.instance);
                this.bot.once('spawn', () => {
                    console.log('Reconnected successfully.');
                });
            }, 10000);
        });
    }
}

module.exports = MCinit;
