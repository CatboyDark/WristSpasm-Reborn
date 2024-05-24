const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
const { CatboyDark } = require('../../../../auth.json');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		const notCatboy = new EmbedBuilder().setColor('FF0000').setDescription('**Only <@622326625530544128> can use this command!**');
		const restart = new EmbedBuilder().setColor('000000').setDescription('**Restarting...**');
        
		if (interaction.user.id !== CatboyDark) 
		{ return interaction.reply({ embeds: [notCatboy] }); }

		exec('git pull && pm2 restart discord', (error, stderr) => 
		{
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}

			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
		});

		interaction.reply({ embeds: [restart] });
	}
};
