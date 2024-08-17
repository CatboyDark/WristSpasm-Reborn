function getMsg(message) 
{
	let chat, rank, sender, guildRank, content;

	if (message.startsWith('From')) 
	{
		chat = 'dm';
		const match = message.match(/^From(?: \[(.*?)\])? (.*?): (.*)$/);
		if (match) 
		{
			rank = match[1] || null;
			sender = match[2];
			content = match[3];
		}
	} 

	else if (message.startsWith('Guild >')) 
	{
		chat = 'guild';
		const match = message.match(/^Guild >(?: \[(.*?)\])? (.*?) \[(.*?)\]: (.*)$/);
		if (match)
		{
			rank = match[1] || null;
			guildRank = match[3] || 'GM';
			sender = match[2];
			content = match[4];
		}
	} 

	else if (message.startsWith('Party >')) 
	{
		chat = 'party';
		const match = message.match(/^Party >(?: \[(.*?)\])? (.*?): (.*)$/);
		if (match){
			rank = match[1] || null;
			sender = match[2];
			content = match[3];
		}
	} 

	else if (message.startsWith('Officer >')) 
	{
		chat = 'staff';
		const match = message.match(/^Officer >(?: \[(.*?)\])?(?: \[(.*?)\])? (.*?): (.*)$/);
		if (match) 
		{
			rank = match[1] || null;
			guildRank = match[2] || 'GM';
			sender = match[3];
			content = match[4];
		}
	}

	return { chat, rank, guildRank, sender, content };
}

function send(bot, str)
{
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let rString = '';
	for (let i = 0; i < 5; i++) 
	{
		const rIndex = Math.floor(Math.random() * chars.length);
		rString += chars[rIndex];
	}
	bot.chat(`${str} [${rString}]`);
}

module.exports = { getMsg, send };