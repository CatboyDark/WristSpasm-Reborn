const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { staffRole } = require('../../../../config.json');

const nonC =
[
	'help',
	'roles'
];

const staffC =
[
	'purge',
	'role',
	'rr',
	'slink',
	'sservers',
	'sevent'
];

module.exports = 
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show bot info'),
		
	async execute(interaction) 
	{
		const commands = await interaction.client.application.commands.fetch();

		const cList = commands
			.filter(cmd => 
			{
				if (interaction.member.roles.cache.some(role => staffRole.includes(role.id))) 
				{ return nonC.includes(cmd.name) || staffC.includes(cmd.name); } 
				else { return nonC.includes(cmd.name); }
			})
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(cmd => `* **\`/${cmd.name}\`** ${cmd.description}`)
			.join('\n');

		const info = new EmbedBuilder()
			.setColor('000000')
			.setThumbnail('https://i.imgur.com/uwqAaeb.png')
			.setTitle('WristSpasm')
			.addFields(
				{ name: '**Commands**', value: `${cList}` + '\n_ _'},
				{
					name: '\n**Credits**', 
					value: '✦ <@1165302964093722697> ✦ <@486155512568741900> ✦ <@1169174913832202306> ✦\n' +
					'_ _\n**Bugs and Support**\n' +
					'[Github](https://github.com/CatboyDark/WristSpasm-Reborn)' + '\n\nPlease contact <@622326625530544128> if something breaks.'
				}
			)
			.setFooter({
				text: 'Created by @CatboyDark',
				iconURL: 'https://i.imgur.com/4lpd01s.png'
			}
			);

		await interaction.reply({ embeds: [info] });
	}
};
