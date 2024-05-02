const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows bot info'),
		
	async execute(interaction) {

		const commands = await interaction.client.application.commands.fetch();
		const commandList = commands
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(cmd => `* **\`\/${cmd.name}\`** ${cmd.description}`)
		.join('\n');

		const info = new EmbedBuilder()
			.setColor(0x000000)
			.setThumbnail('https://i.imgur.com/uwqAaeb.png')
			.setTitle('WristSpasm')
			.addFields(
				{ name: '**Commands**', value: `${commandList}` },
				{ name: '**Credits**', value: 
					`✦ <@1165302964093722697>
					✦ <@486155512568741900>
					✦ <@1169174913832202306>`}
			)
			.setFooter({
				text: "Created by @CatboyDark",
				iconURL: "https://i.imgur.com/4lpd01s.png"
			})

		await interaction.reply({ embeds: [info] });
	},
};
