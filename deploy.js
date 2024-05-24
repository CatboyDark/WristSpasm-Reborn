const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./auth.json');
const fs = require('fs');
const path = require('path');

// Read command files

const readCommandFiles = (commandsPath) => 
{
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	return commandFiles.map(file => {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if (command.data && command.execute) {
			return command.data.toJSON();
		} else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			return null;
		}
	}).filter(Boolean);
};

// Collect all commands

const collectCommands = (foldersPath) => 
{
	const commandFolders = fs.readdirSync(foldersPath);
	return commandFolders.flatMap(folder => {
		const commandsPath = path.join(foldersPath, folder);
		return readCommandFiles(commandsPath);
	});
};

(async () => 
{
	try {
		const foldersPath = path.join(__dirname, 'src', 'discord', 'cmds');
		const commands = collectCommands(foldersPath);

		const rest = new REST({ version: '10' }).setToken(token);
		await rest.put(Routes.applicationCommands(clientId), { body: commands });

		console.log(`Successfully reloaded ${commands.length} commands!`);
	} 
	catch (error) {
		console.error('Error:', error);
	}
})();