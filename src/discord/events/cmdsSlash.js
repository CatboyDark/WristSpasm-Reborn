const { Events } = require('discord.js');
const { createMsg } = require('../../helper/builder.js');
const log = require('../../helper/logger.js');
const { readConfig } = require('../../helper/utils.js');

const cmdError = (interaction) => 
{
	return async (error) => 
	{
		const eMsg = createMsg({
			color: 'FF0000',
			title: 'Oops! That wasn\'t supposed to happen!',
			desc: 
					'Staff has been notified. Thank you for your patience!'
		});
	
		const eMsgStaff = createMsg({
			color: 'FF0000',
			title: 'A Silly Has Occured!',
			desc: 
					`\`${error.message}\`\n\n` +
					'**If you believe this is a bug, please contact <@622326625530544128>.**'
		});
	
		const config = readConfig();
		const logsChannel = await interaction.client.channels.fetch(config.logsChannel);
	
		logsChannel.send({ embeds: [eMsgStaff] });
		console.error(error);
	
		if (interaction.replied || interaction.deferred) 
		{
			return interaction.followUp({ embeds: [eMsg] });
		} 
		else 
		{
			return interaction.reply({ embeds: [eMsg] });
		}
	};
};

module.exports = 
[
	{
		name: Events.InteractionCreate,
		async execute(interaction) 
		{
			if (!interaction.isChatInputCommand()) return;
			log(interaction);

			const command = interaction.client.sc.get(interaction.commandName);
			await command.execute(interaction).catch(cmdError(interaction));
		}
	}
];