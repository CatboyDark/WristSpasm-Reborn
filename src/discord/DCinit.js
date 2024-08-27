const { Client, Partials, Collection, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { appID, token } = require('../../config.json');
const { createMsg } = require('../helper/builder.js');
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
		const cDir = path.join(__dirname, 'cmds');
		const cFiles = fs.readdirSync(cDir);

		const commands = [];

		for (const c of cFiles) 
		{
			const cp = path.join(cDir, c);
			const cf = fs.readdirSync(cp).filter((file) => file.endsWith('.js'));

			for (const f of cf) 
			{
				const fp = path.join(cp, f);
				const cmd = require(fp);

				if (cmd.type === 'plain') 
				{
					this.client.pc.set(cmd.name, cmd);
				}
				if (cmd.type === 'slash') 
				{
					this.client.sc.set(cmd.data.name, cmd);
					commands.push(cmd.data.toJSON());
				}
			}
		}

		const rest = new REST({ version: '10' }).setToken(this.token);
		await rest.put(Routes.applicationCommands(this.appID), { body: commands });

		this.client.on('message', async (message) => 
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
			else console.error(`${e} does not export an array of events`);
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
		if (!response.ok) throw new Error('Failed to fetch emojis D:');
	
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