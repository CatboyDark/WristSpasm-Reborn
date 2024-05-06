const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./auth.json');
const { catboy, logsChannel } = require('./config.json');
const mineflayer = require('mineflayer');


const client = new Client({ 
    intents: 
    [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
    ] 
});

// Discord Init

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'src', 'discord', 'cmds');
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

const eventsPath = path.join(__dirname, 'src', 'discord', 'events');
const eventsFolder = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventsFolder) {
  const event = require(path.join(eventsPath, file));
  event.once
  	? client.once(event.name, (...args) => event.execute(...args))
  	: client.on(event.name, (...args) => event.execute(...args));
}

client.login(token);

// Minecraft Init

let mcInit = {
    host: 'mc.hypixel.net',
    username: catboy,
    auth: 'microsoft',
    version: "1.8.9",
    viewDistance: "tiny",
    chatLengthLimit: 256
} 

mcBot = mineflayer.createBot(mcInit);

mcBot.on('login', () => {
    let botSocket = mcBot._client.socket;
    console.log(`${catboy} has joined ${botSocket.server ? botSocket.server : botSocket._host}.`);
    mcBot.chat('/w CatboyDark meow');
})

mcBot.on('kicked', (reason) => { console.log(`Kicked: ${reason}`); });

mcBot.on("error", console.log);
mcBot.on('end', () => { 
    console.log(`${catboy} has disconnected.`);
});

mcBot.on('message', message =>
    {
        let content = message.toString().trim();
        if (content.length < 1) { return; }
        let channel = client.channels.cache.get(logsChannel);
        channel.send(content);
    }
)
/*
client.on('message', message => {
    if (message.channel.id === logsChannel) {
        let content = message.content;
        mcBot.chat(content);
    }
});
*/