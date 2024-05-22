const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { statusChannel } = require('../../config.json');
const { EmbedBuilder } = require('discord.js');
const interactionCreate = require('./interactionCreate.js');

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
        },
        { partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }
    );

		this.token = token;
        this.client.commands = new Collection();

		// Commands

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
                this.client.commands.set(cmd.data.name, cmd);
            }
        }

        interactionCreate.once
        ? this.client.once(interactionCreate.name, (...args) => interactionCreate.execute(...args))
        : this.client.on(interactionCreate.name, (...args) => interactionCreate.execute(...args));
        
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
			const dcOnline = new EmbedBuilder()
				.setColor(0x00FF00)
				.setDescription('**Status: Online!**')
	
			let status;
	
			const channel = this.client.channels.cache.get(statusChannel);
			status = channel.send({ embeds: [dcOnline] });

			console.log(`Discord is online!`);
		});
	}
}

module.exports = DCinit;