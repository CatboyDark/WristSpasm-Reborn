const mineflayer = require('mineflayer');
const path = require('path');
const fs = require('fs');
const { ign } = require('../../auth.json');

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

		// Commands

		const cDir = path.join(__dirname, 'cmds');
		const cFiles = fs.readdirSync(cDir).filter((file) => file.endsWith('.js'));

		this.bot.on('message', (message) => 
		{
			const content = message.toString();

			if (content.startsWith('Officer >')) 
			{
				const msg = getMsg(content.slice(10).trim());
				if (msg) cmds('officer', msg);
			}
			else if (content.startsWith('Guild >')) 
			{
				const msg = getMsg(content.slice(8).trim());
				if (msg) cmds('guild', msg);
			}
		});

		const getMsg = (message) =>
		{
			const match = message.match(/^[^:]+: (.*)$/);
			return match ? match[1] : null;
		};

		const cmds = (type, content) => 
		{
			const args = content.split(/ +/);
			const command = args.shift().toLowerCase();

			for (const c of cFiles) 
			{
				const cp = path.join(cDir, c);
				const cmd = require(cp);

				if (cmd.type === type && command === cmd.command.toLowerCase()) 
				{
					cmd.execute(this.bot, args, this.client);
					return;
				}
			}
		};

		// Features

		const fDir = path.join(__dirname, 'features');
		const fFiles = fs.readdirSync(fDir).filter((file) => file.endsWith('.js'));

		for (const f of fFiles) 
		{
			const fp = path.join(fDir, f);
			const feature = require(fp);
			if (typeof feature === 'function')
			{ feature(this.bot, this.client); }
			else { console.error(`Feature at ${fp} is not a function.`); }
		}

		// Logic

		this.Logic = {};
		const lDir = path.join(__dirname, './logic');
		const lFiles = fs
			.readdirSync(lDir)
			.filter((file) => file.endsWith('.js'));

		for (const file of lFiles) 
		{
			const logicModule = require(path.join(lDir, file));
			if (typeof logicModule === 'object' && logicModule !== null) 
			{ Object.assign(this.Logic, logicModule); }
			else { this.Logic[file.replace('.js', '')] = logicModule; }
		}
	}

	login() 
	{
		this.bot.on('login', () => 
		{
			const botSocket = this.bot._client.socket;
			console.log(`${this.instance.username} has joined ${botSocket.server ? botSocket.server : botSocket._host}.`);

			this.Logic.limbo(this.bot);
		});

		this.bot.on('kicked', (reason) => 
		{
			console.log(`Kicked: ${reason}`);
			console.log('Attempting to reconnect in 10 seconds...');

			setTimeout(() => 
			{
				this.bot = mineflayer.createBot(this.instance);
				this.bot.once('spawn', () => 
				{
					console.log('Reconnected.');
					this.Logic.limbo(this.bot);
				});
			}, 10000);
		});

		this.bot.on('error', console.log);

		this.bot.on('end', () => 
		{
			console.log(`${this.instance.username} has disconnected.`);
			console.log('Attempting to reconnect in 10 seconds...');

			setTimeout(() => 
			{
				this.bot = mineflayer.createBot(this.instance);
				this.bot.once('spawn', () => 
				{
					console.log('Reconnected.');
				});
			}, 10000);
		});
	}
}

module.exports = MCinit;
