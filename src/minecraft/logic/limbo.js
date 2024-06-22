module.exports = function(bot) 
{
	const spamInterval = setInterval(() => {bot.chat('/');}, 250);

	bot.on('message', (message) => 
	{
		if (message.toString().includes('disconnect.spam')) {
			clearInterval(spamInterval);
		}
	});
};
