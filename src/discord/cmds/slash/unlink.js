const { createSlash, createMsg, createError } = require('../../../helper/builder.js');
const { readConfig } = require('../../../helper/utils.js');
const { Link } = require('../../../mongo/schemas.js');

const notLinked = createError('**You are not linked!**');
const success = createMsg({ desc: '**You are now unlinked!**' });

module.exports = createSlash({
	name: 'unlink',
	desc: 'Unlink your discord',
		
	async execute(interaction) 
	{
		const result = await Link.findOneAndDelete({ dcid: interaction.user.id });

		if (result) 
		{
			await interaction.reply({ embeds: [success] });

			const config = readConfig();
			if (config.features.linkRoleToggle)
			{
				const member = await interaction.guild.members.fetch(interaction.user.id);
				if(member.roles.cache.has(config.features.linkRole)) 
					await member.roles.remove(config.features.linkRole);
			}
			if (config.features.guildRoleToggle)
			{
				if (interaction.member.roles.cache.has(config.features.guildRole))
					await interaction.member.roles.remove(config.features.guildRole);
			}
		} 
		else 
		{
			await interaction.reply({ embeds: [notLinked] });
		}
	}
});