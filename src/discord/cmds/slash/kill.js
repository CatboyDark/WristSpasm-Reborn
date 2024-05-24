const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');
const { CatboyDark } = require('../../../../auth.json');

module.exports = 
{
	data: new SlashCommandBuilder()
	    .setName('kill')
	    .setDescription('Kill the bot')
	    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		const notCatboy = new EmbedBuilder().setColor('FF0000').setDescription('**Only <@622326625530544128> can use this command!**');
		const stop = new EmbedBuilder().setColor('000000').setDescription('**Stopping...**');

		if (interaction.user.id !== CatboyDark) 
		{ return interaction.reply({ embeds: [notCatboy] }); }

		exec('pm2 stop discord', (error, stderr) => 
		{
			if (error) {
				console.log(`Error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`STD Error: ${stderr}`);
				return;
			}
		});

		interaction.reply({ embeds: [stop]});
	}
};
