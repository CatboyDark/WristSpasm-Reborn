const mineflayer = require('mineflayer');
const path = require('path');
const fs = require('fs');
const { ign } = require('../../config.json');
const { getMsg } = require('./logic/chat.js');

class MC
{
	constructor(client)
	{
		this.instance = 
		{
			host: 'mc.hypixel.net',
			username: ign,
			auth: 'microsoft',
			version: '1.8.9',
			viewDistance: 'tiny',
			chatLengthLimit: 256
		};

		this.client = client;
		this.bot = mineflayer.createBot(this.instance);

		this.initCmds();
		this.initFeatures();
		this.initLogic();
		this.login();
	}

	initCmds() 
	{
		this.cDir = path.join(__dirname, 'cmds');
		this.cFiles = fs.readdirSync(this.cDir).filter(file => file.endsWith('.js'));
		this.cList = new Map();

		for (const c of this.cFiles) 
		{
			const cp = path.join(this.cDir, c);
			const cmd = require(cp);
			if (cmd.command) 
			{
				this.cList.set(cmd.command.toLowerCase(), cmd);
			}
		}

		this.bot.on('message', message => 
		{
			const { chat, rank, guildRank, sender, content } = getMsg(message.toString());
			if (!content) return;
		
			const [commandName, ...args] = content.split(/ +/);
			const command = commandName.toLowerCase();
			
			if (this.cList.has(command)) 
			{
				const cmd = this.cList.get(command);
				if (cmd.chat.includes(chat) || (chat === 'staff' && cmd.chat.includes('guild'))) 
				{
					const msg = { chat, rank, guildRank, sender, content, args };
					cmd.execute(this.client, msg);
				}
			}
		});
	}
	
	initFeatures()
	{
		const fDir = path.join(__dirname, 'features');
		const fFiles = fs.readdirSync(fDir).filter((file) => file.endsWith('.js'));

		for (const f of fFiles) 
		{
			const fp = path.join(fDir, f);
			const feature = require(fp);
			if (typeof feature === 'function') feature(this.bot, this.client);
			else console.error(`Feature at ${fp} is not a function.`);
		}
	}

	initLogic()
	{
		this.Logic = {};
		const lDir = path.join(__dirname, './logic');
		const lFiles = fs.readdirSync(lDir).filter((file) => file.endsWith('.js'));

		for (const file of lFiles) 
		{
			const logicModule = require(path.join(lDir, file));
			if (typeof logicModule === 'object' && logicModule !== null) Object.assign(this.Logic, logicModule);
			else this.Logic[file.replace('.js', '')] = logicModule;
		}
	}

	login()
	{
		this.bot.on('login', this.onLogin.bind(this));
		this.bot.on('kicked', this.onKick.bind(this));
		this.bot.on('error', this.onError.bind(this));
		this.bot.on('end', this.onEnd.bind(this));
	}

	onLogin() 
	{
		const { server, _host } = this.bot._client.socket;
		console.log(`${this.instance.username} has joined ${server || _host}.`);
		this.Logic.limbo(this.bot);
	}

	onKick(reason) 
	{
		console.log(`Kicked: ${reason}`);
		this.reconnect();
	}

	onError(error) 
	{
		console.error(`Error: ${error.message}`);
	}

	onEnd() 
	{
		console.log(`${this.instance.username} has disconnected.`);
		this.reconnect();
	}

	reconnect() {
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
	}
}

module.exports = MC;