const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { channels: { statusChannel } } = require('../../config.json');

class DCinit 
{
	constructor(token) {

		this.client = new Client({
			intents: 
            [
            	GatewayIntentBits.Guilds,
            	GatewayIntentBits.GuildMessages,
            	GatewayIntentBits.MessageContent,
            	GatewayIntentBits.GuildMembers
            ]
		});

		this.token = token;

		// Commands

		this.client.pc = new Collection();
		this.client.sc = new Collection();

		const cDir = path.join(__dirname, 'cmds');
		const cFiles = fs.readdirSync(cDir);

		for (const c of cFiles)
		{
			const cp = path.join(cDir, c);
			const cf = fs.readdirSync(cp).filter(file => file.endsWith('.js'));
			for (const f of cf)
			{
				const fp = path.join(cp, f);
        		const cmd = require(fp);
        
        		if (cmd.type === 'plain') { this.client.pc.set(cmd.name, cmd); } 
				if (cmd.type === 'slash') { this.client.sc.set(cmd.data.name, cmd); } 
			}
		}

		// Events

		const eDir = path.join(__dirname, 'events');
		const eFiles = fs.readdirSync(eDir).filter(file => file.endsWith('.js'));

		for (const e of eFiles) 
		{
			const ep = path.join(eDir, e);
			const event = require(ep);
			if (event.once) {
				this.client.once(event.name, (...args) => event.execute(...args));
			} else {
				this.client.on(event.name, (...args) => event.execute(...args));
			}
		}
        
		// Features

		const fDir = path.join(__dirname, 'features');
		const fFiles = fs.readdirSync(fDir).filter(file => file.endsWith('.js'));

		for (const f of fFiles)
		{
			const fp = path.join(fDir, f);
			const feature = require(fp);
			feature(this.client);
		}

	}

	login() {
		this.client.login(this.token);
	
		this.client.on('ready', () => 
		{
			const dcOnline = new EmbedBuilder().setColor(0x00FF00).setDescription('**Status: Online!**');
	
			const channel = this.client.channels.cache.get(statusChannel);
			channel.send({ embeds: [dcOnline] });

			console.log('Discord is online!');
		});
	}
}

module.exports = DCinit;
