const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const played = new Set();

async function eventA(interaction) 
{ 
	const success = new EmbedBuilder().setColor('00FF00').setDescription('**Success!**');

	const embed = new EmbedBuilder().setColor('000000').setDescription(
		'### Welcome to Event A!' +
		'\nThere are 25 buttons:' +
		'\n- One button contains 100m coins.' +
		'\n- Two buttons contain 25m coins.' +
		'\n\nYou have ONE chance. Good Luck!' +
		'\n\n**Note: This is a global event. Once someone finds a prize, no one else will be able to get it.**'
	);

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId('eventA_start').setLabel('Start!').setStyle(ButtonStyle.Success)
	);

	await interaction.channel.send({ embeds: [embed], components: [row] });
	await interaction.reply({ embeds: [success], ephemeral: true });
}

async function eventA_start(interaction) 
{ 
	if (played.has(interaction.user.id)) {
		return interaction.reply({ content: 'You have already played this game!', ephemeral: true });
	}

	const rows = [];
	for (let i = 0; i < 5; i++) {
		rows.push(new ActionRowBuilder());
	}

	for (let i = 0; i < 25; i++) {
		const button = new ButtonBuilder()
			.setCustomId('button' + i)
			.setLabel('🐱')
			.setStyle(ButtonStyle.Success);

		rows[Math.floor(i / 5)].addComponents(button);
	}

	const prize1 = 'button' + Math.floor(Math.random() * 25);

	const filter = (i) => i.customId.startsWith('button');
	const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

	collector.on('collect', async (i) => {
		if (i.customId === prize1) {
			await i.reply({ content: 'Congrats! You won 100M!', ephemeral: true });
			collector.stop();
		} else {
			await i.reply({ content: 'Bleh.', ephemeral: true });
		}
	});

	collector.on('end', async collected => {
		console.log(`Collected ${collected.size} interactions.`);
		rows.forEach(row => {
			row.components.forEach(button => {
				if (button.data.custom_id === prize1) {
					button.setStyle(ButtonStyle.Success).setLabel('🎉');
				} else {
					button.setDisabled(true);
				}
			});
		});
		await interaction.editReply({ components: rows });
	});


	await interaction.reply({ components: rows, ephemeral: true });

}

module.exports = { eventA, eventA_start };
