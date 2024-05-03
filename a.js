const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const { token, catboy } = require('./auth.json');
const path = require('node:path');

const mineflayer = require('mineflayer');
const mcBot = mineflayer.createBot({ 
	host: 'mc.hypixel.net', 
	username: catboy,
	auth: 'microsoft',
	version: '1.8.9'
})

const client = new Client({ 
    intents: 
    [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
    ] 
});

// Commands

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'cmds');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}
}

// Events

const eventsPath = path.join(__dirname, "events");
const eventsFolder = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventsFolder) {
  const event = require(path.join(eventsPath, file));
  event.once
  	? client.once(event.name, (...args) => event.execute(...args))
  	: client.on(event.name, (...args) => event.execute(...args));
}

client.login(token);