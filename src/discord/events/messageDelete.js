const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageDelete,
    async execute(deletedMessage) {
        console.log(`Attempting to delete message ID: ${deletedMessage.id}`);
        let data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
        console.log('Current Reaction Roles data:', data['Reaction Roles']);

        // Check if 'Reaction Roles' exists and iterate over its entries
        if (data['Reaction Roles']) {
            let found = false;
            for (const [key, value] of Object.entries(data['Reaction Roles'])) {
                // Check if the current entry's messageId matches the deletedMessage.id
                if (value.messageId === deletedMessage.id) {
                    delete data['Reaction Roles'][key];
                    console.log(`Deleted message ID: ${deletedMessage.id} from Reaction Roles`);
                    found = true;
                    break; // Stop the loop after finding and deleting the entry
                }
            }

            // If an entry was found and deleted, write the updated data back to data.json
            if (found) {
                let formattedData = JSON.stringify(data, null, 4);
                fs.writeFileSync('data.json', formattedData);
            } else {
                console.log('No matching message ID found in Reaction Roles');
            }
        } else {
            console.log('Reaction Roles data is empty or does not exist');
        }

    }
};