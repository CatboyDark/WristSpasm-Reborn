const DC = require('./src/discord/DCinit');
const MC = require('./src/minecraft/MCinit');
const Mongo = require('./src/mongo/mongoInit');

async function start()
{
	await Mongo();

	const discord = new DC();
	await discord.init();
	
	// new MC(discord.client);
};

start();