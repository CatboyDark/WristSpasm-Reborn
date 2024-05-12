const { Events } = require('discord.js');
const fs = require('fs');
const config = require('../../../config.json');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) 
	{
		if (interaction.isChatInputCommand())
		{
			const command = interaction.client.commands.get(interaction.commandName);

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
		else if (interaction.isButton())
		{
			const buttonId = interaction.customId;
			
			switch (buttonId) 
			{
				case 'rr':
					const member = interaction.guild.members.cache.get(interaction.user.id);
					const data = JSON.parse(fs.readFileSync('data.json'));
					const roleId = data[interaction.message.embeds[0].description];
					const role = interaction.guild.roles.cache.get(roleId);

					if (roleId === '1183240686678589541')
					{ if (!member.roles.cache.has(config.gmemberRole)) { return interaction.reply({ content: 'You must be a guild member to join our SMP!', ephemeral: true }); } }
			
					if (member.roles.cache.has(role.id)) {
						await member.roles.remove(role);
						await interaction.reply({ content: `${role} has been removed!`, ephemeral: true });
					} else {
						await member.roles.add(role);
						await interaction.reply({ content: `${role} has been added!`, ephemeral: true });
					}
				break;
				}
			}
		else { return; }
	},
};