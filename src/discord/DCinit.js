const { Client, Partials, Collection, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { appID, token } = require('../../config.json');
const { createMsg, createSlash } = require('../helper/builder.js');
const { readConfig } = require('../helper/utils.js');
const emojis = path.join(__dirname, '../../assets/emojis');

class DC
{
	constructor()
	{
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildScheduledEvents
			],
			partials: [
				Partials.Message,
				Partials.Channel,
				Partials.GuildMember,
				Partials.User
			]
		});

		this.token = token;
		this.appID = appID;
		this.client.pc = new Collection();
		this.client.sc = new Collection();
	}

	async init() 
	{
		await this.initCmds();
		await this.initEvents();
		await this.initEmojis();
		this.login();
	}

	async initCmds() 
	{
		const slashDir = path.join(__dirname, 'cmds/slash');
		const plainDir = path.join(__dirname, 'cmds/plain');
		
		const slashFiles = fs.readdirSync(slashDir);
		const plainFiles = fs.readdirSync(plainDir);

		const slashCommands = [];

		for (const f of slashFiles) 
		{
			const filePath = path.join(slashDir, f);
			const cmdData = require(filePath);

			const slashCmd = createSlash(cmdData);
			this.client.sc.set(slashCmd.data.name, slashCmd);
			slashCommands.push(slashCmd.data.toJSON());
		}

		const rest = new REST({ version: '10' }).setToken(this.token);
		await rest.put(Routes.applicationCommands(this.appID), { body: slashCommands });

		for (const f of plainFiles) 
		{
			const filePath = path.join(plainDir, f);
			const cmdData = require(filePath);

			this.client.pc.set(cmdData.name, cmdData);
		}
		
		this.client.on('messageCreate', async (message) => 
		{
			if (message.author.bot) return;

			const args = message.content.trim().split(/ +/);
			const commandName = args.shift().toLowerCase();

			if (this.client.pc.has(commandName)) 
			{
				const command = this.client.pc.get(commandName);
				await command.execute(message, args);
			}
		});
	}

	async initEvents() 
	{
		const eDir = path.join(__dirname, 'events');
		const eFiles = fs.readdirSync(eDir).filter(file => file.endsWith('.js'));
	
		for (const e of eFiles) 
		{
			const ep = path.join(eDir, e);
			const events = require(ep);
	
			if (Array.isArray(events))
			{
				for (const event of events) this.client.on(event.name, (...args) => event.execute(...args));
			}
			else console.error(`${e} is incomplete!`);
		}
	}

	async initEmojis() 
	{
		const response = await fetch(`https://discord.com/api/v10/applications/${this.appID}/emojis`, 
			{
				method: 'GET',
				headers: {
					'Authorization': `Bot ${this.token}`
				}
			});
		if (!response.ok) throw new Error('Failed to fetch emojis :(');
	
		const existingEmojis = await response.json();
		this.client.emojiMap = new Map(existingEmojis.items.map(emoji => [emoji.name, emoji.id]));
	
		const files = fs.readdirSync(emojis);
	
		for (const file of files) 
		{
			const filePath = path.join(emojis, file);
			const fileName = path.parse(file).name;
	
			if (path.extname(file) === '.png' && !this.client.emojiMap.has(fileName)) 
			{
				const base64Image = `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
				const postResponse = await fetch(`https://discord.com/api/v10/applications/${this.appID}/emojis`, 
					{
						method: 'POST',
						headers: {
							'Authorization': `Bot ${this.token}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							name: fileName,
							image: base64Image
						})
					});
				if (postResponse.ok) 
				{
					const newEmoji = await postResponse.json();
					this.client.emojis.cache.set(newEmoji.id, newEmoji);
					this.client.emojiMap.set(newEmoji.name, newEmoji.id);
					console.log(`New Emoji: ${fileName}`);
				} 
				else console.error(`Failed to add emoji: ${fileName}`, await postResponse.json());
			}
		}
	}
	
	login()
	{
		this.client.login(this.token);

		this.client.on('ready', () => 
		{
			const config = readConfig();
			if (config.logsChannel)
			{
				const channel = this.client.channels.cache.get(config.logsChannel);
				channel.send({ embeds: [createMsg({ desc: '**Discord is Online!**' })] });
			}
			if (config.guild)
			{
				this.client.user.setActivity(config.guild, {type: ActivityType.Watching});
			}
			console.log('Discord is online!');
		});
	}
}

module.exports = DC;