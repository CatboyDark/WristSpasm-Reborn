module.exports = async (bot) =>
{
	const limbo = setInterval(() => { bot.chat('/'); }, 250);
	
	bot.on('message', (message) => 
	{
		if (message.toString().includes('disconnect.spam')) 
		{ clearInterval(limbo); }
	});
};