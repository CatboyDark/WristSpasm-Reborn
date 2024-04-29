const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: 
    [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
    ] 
});

client.on("message", (message) => 
{
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes("bot")) {
        message.channel.send("Hello, I'm a bot!");
    }
});