const { Events } = require('discord.js');
const fs = require('fs');

module.exports = 
{
	name: Events.MessageDelete,
	async execute(deletedMessage) {
		const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};

		if (data['Reaction Roles']) {
			let found = false;
			for (const [key, value] of Object.entries(data['Reaction Roles'])) {
				if (value.messageId === deletedMessage.id) {
					delete data['Reaction Roles'][key];
					found = true;
					break;
				}
			}

			if (found) {
				const formattedData = JSON.stringify(data, null, 4);
				fs.writeFileSync('data.json', formattedData);
			}
		}
	}
};
