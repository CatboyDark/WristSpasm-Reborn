const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { statusChannel } = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

class DCinit 
{
	constructor(token) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

		this.token = token;
        this.client.commands = new Collection();

		// Commands

		const commandsPath = path.join(__dirname, 'cmds');
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

        for(const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            this.client.commands.set(command.data.name, command);
        }

		// Events

		const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

        for(const file of eventFiles) {
            const event = require(path.join(eventsPath, file));
            event.once
                ? this.client.once(event.name, (...args) => event.execute(...args))
                : this.client.on(event.name, (...args) => event.execute(...args));
        }

		// Features

		const featuresPath = path.join(__dirname, 'features');
        const featureFiles = fs.readdirSync(featuresPath).filter(file => file.endsWith('.js'));

        for (const file of featureFiles) {
            const feature = require(path.join(featuresPath, file));
            feature(this.client);
        }
    }

	login() {
		this.client.login(this.token);
	
		this.client.once('ready', () => {
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