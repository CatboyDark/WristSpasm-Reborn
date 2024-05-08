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

		const foldersPath = path.join(__dirname, 'cmds');
        const commandFolders = fs.readdirSync(foldersPath);

        for(const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                this.client.commands.set(command.data.name, command);
            }
        }

		const eventsPath = path.join(__dirname, 'events');
        const eventsFolder = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

        for(const file of eventsFolder) {
            const event = require(path.join(eventsPath, file));
            event.once
                ? this.client.once(event.name, (...args) => event.execute(...args))
                : this.client.on(event.name, (...args) => event.execute(...args));
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