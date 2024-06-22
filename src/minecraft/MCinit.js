const mineflayer = require('mineflayer');
const path = require('path');
const fs = require('fs');
const { logsChannel } = require('../../config.json');
const { ign } = require('../../auth.json');
const ignore = JSON.parse(fs.readFileSync('ignore.json'));
const { bridge } = require('../../data.json');

class MCinit
{

	constructor(client) 
	{
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
	}

	loadFeatures()
	{
		const fDir = path.join(__dirname, 'features');
		const fFiles = fs.readdirSync(fDir).filter(file => file.endsWith('.js'));

		for (const f of fFiles) {
			const fp = path.join(fDir, f);
			const feature = require(fp);
			feature(this.client);
		}
	}

	limbo()
	{
		const spamInterval = setInterval(() => {this.bot.chat('/');}, 250);

		this.bot.on('message', (message) => {
			if (message.toString().includes('disconnect.spam')) {
				clearInterval(spamInterval);
			}
		});
	}

	login() 
	{
		this.bot.on('login', () => {
			const botSocket = this.bot._client.socket;
			console.log(`${this.instance.username} has joined ${botSocket.server ? botSocket.server : botSocket._host}.`);

			this.bot.chat('/w PuppyboyDark meow');
			this.limbo();
		});

		this.bot.on('kicked', (reason) => { console.log(`Kicked: ${reason}`); });

		this.bot.on('error', console.log);

		this.bot.on('end', () => { 
			console.log(`${this.instance.username} has disconnected.`);
		});

		this.bot.on('message', message => {
			if (!bridge) { return; }
			
			const content = message.toString().trim();
			const isIgnored = ignore.some(ignoredPhrase => content.startsWith(ignoredPhrase));
			if (content.length < 1 || isIgnored) { return; }
			const channel = this.client.channels.cache.get(logsChannel);
            
			channel.send(`${content}`);
		});

		this.client.on('messageCreate', message => 
		{
			const channel = this.client.channels.cache.get(logsChannel);
			if (message.channel.id === channel.id) 
			{
				const content = message.content;
				if (message.author.bot) { return; }

				this.bot.chat(content);
			}
		});
	}
}

module.exports = MCinit;