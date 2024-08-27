const { createMsg, createSlash, createError } = require('../../../helper/builder');

const minCount = createError('You must purge at least one message!');
const maxCount = createError('You can only purge up to 100 messages!');
const ageLimit = createError('You cannot purge messages older than 14 days!');

module.exports = createSlash({
	name: 'purge',
	desc: 'Purge messages',
	options: [
		{ type: 'integer', name: 'count', desc: 'Number of messages', required: true },
		{ type: 'string', name: 'filter', desc: 'User OR bot messages', choices: [
			{ name: 'Bot Messages', value: 'bot' },
			{ name: 'User Messages', value: 'user' }
		]}
	],
	permissions: ['ManageMessages'],

	async execute(interaction) 
	{
		const filter = interaction.options.getString('filter');
		const count = interaction.options.getInteger('count');
        
		if (count < 1) return interaction.reply({ embeds: [minCount], ephemeral: true });
		if (count > 100) return interaction.reply({ embeds: [maxCount], ephemeral: true });

		let messages = await interaction.channel.messages.fetch({ limit: count });

		if (filter === 'user') messages = messages.filter(msg => !msg.author.bot);
		if (filter === 'bot') messages = messages.filter(msg => msg.author.bot);

		const now = Date.now();
		messages = messages.filter(msg => (now - msg.createdTimestamp) <= 1209600000);

		if (messages.size > 0) 
		{
			await interaction.channel.bulkDelete(messages, true);
			const success = count === 1 
				? createMsg({ desc: '**Deleted a message.**' })
				: createMsg({ desc: `**Deleted ${messages.size} ${filter === 'user' ? 'user' : filter === 'bot' ? 'bot' : ''} messages.**` });
			await interaction.reply({ embeds: [success], ephemeral: true });
		} 
		else 
		{
			await interaction.reply({ embeds: [ageLimit], ephemeral: true });
		}
	}
});
