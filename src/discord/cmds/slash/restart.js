const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');
const CatboyDark = require('../../../../auth.json').CatboyDark;

module.exports = 
{
	data: new SlashCommandBuilder()
    .setName('restart')
	.setDescription('Restart the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) 
	{
        if (interaction.user.id !== CatboyDark) 
        { return interaction.reply({ content: 'Only <@622326625530544128> can use this command!', ephemeral: true }); }

        exec('git pull && pm2 restart discord', (error, stderr) => 
        {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return
            }
        });

        interaction.reply({ content: 'Restarting...', ephemeral: true });
    }
};
