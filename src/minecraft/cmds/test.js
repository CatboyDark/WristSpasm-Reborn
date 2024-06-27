module.exports = (bot) => 
{
    bot.on('message', (message) => 
    {
		const text = message.toString().trim();

        if (text.startsWith('Officer') && text.includes('is kath a raging homosexual')) 
		{ bot.chat('/oc yep.'); }
    });
};
