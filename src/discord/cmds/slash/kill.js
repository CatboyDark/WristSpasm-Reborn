const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');
const e = require('../../../e');

module.exports = 
{
	type: 'slash',
	data: new SlashCommandBuilder()
	    .setName('kill')
	    .setDescription('Kill the bot')
	    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		if (e.notCatboy(interaction)) { return; };
		
		const stop = new EmbedBuilder().setColor('000000').setDescription('**Stopping...**');

		exec('pm2 stop wsr', e.errors);

		interaction.reply({ embeds: [stop]});
	}
};
