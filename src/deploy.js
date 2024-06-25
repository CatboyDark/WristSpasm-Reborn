const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../auth.json');
const fs = require('fs');
const path = require('path');

// Read commands

const readCommandFile = (filePath) => 
{
    try {
        const command = require(filePath);
        if (command.data && command.execute) {
            return command.data.toJSON();
        } else {
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            return null;
        }
    } catch (error) {
        console.error(`Error reading command file at ${filePath}:`, error);
        return null;
    }
};

// Collect commands

const collectCommands = (commandsPath) =>
{
    const commandsPathSlash = path.join(commandsPath, 'slash');
    const commandFiles = fs.readdirSync(commandsPathSlash).filter(file => file.endsWith('.js'));

    return commandFiles.flatMap(file => {
        const filePath = path.join(commandsPathSlash, file);
        return readCommandFile(filePath);
    }).filter(Boolean);
};

// Deploy commands

const deploy = async () => 
{
    try {
        const foldersPath = path.join(__dirname, 'discord', 'cmds');
        const commands = collectCommands(foldersPath);

        const rest = new REST({ version: '10' }).setToken(token);
        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log(`Successfully reloaded ${commands.length} commands!`);
    } catch (error) {
        console.error(error);
    }
};

module.exports = deploy;
