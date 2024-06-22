const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const e = require('../../e.js');

const lDir = path.join(__dirname, '../logic');
const lFiles = fs.readdirSync(lDir).filter(file => file.endsWith('.js'));

const Logic = lFiles.reduce((acc, file) => 
{
	const logicModule = require(path.join(lDir, file));

	if (typeof logicModule === 'object' && logicModule !== null) 
	{ Object.assign(acc, logicModule); } 
	else { acc[file.replace('.js', '')] = logicModule; }

	return acc;
}, {});

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) 
	{
		if (interaction.isChatInputCommand()) 
		{
			const command = interaction.client.commands.get(interaction.commandName);
			await command.execute(interaction).catch(e.cmdErrors(interaction));
		}

		else if (interaction.isButton()) {
			const buttons = interaction.customId;

			switch (buttons) 
			{
			case 'rr':
				await Logic.rrLogic(interaction);
				break;

			case 'link':
				await Logic.linkMsg(interaction);
				break;

			case 'linkhelp':
				await Logic.linkHelpMsg(interaction);
				break;

			// sServers
			
			case 'sbz':
				await Logic.sbz(interaction);
				break;

			case 'sbm':
				await Logic.sbm(interaction);
				break;
			
			case 'cow':
				await Logic.cow(interaction);
				break;

			case 'exocafe':
				await Logic.exocafe(interaction);
				break;
			

			case 'skyhelper':
				await Logic.skyhelper(interaction);
				break;
			

			case 'ims':
				await Logic.ims(interaction);
				break;
			

			case 'bingob':
				await Logic.bingob(interaction);
				break;
			

			case 'kuudra':
				await Logic.kuudra(interaction);
				break;
			

			case 'hunters':
				await Logic.hunters(interaction);
				break;
			

			case 'dsg':
				await Logic.dsg(interaction);
				break;
			
			case 'patcher':
				await Logic.patcher(interaction);
				break;

			case 'skyclient':
				await Logic.skyclient(interaction);
				break;

			case 'sba':
				await Logic.sba(interaction);
				break;

			case 'st':
				await Logic.st(interaction);
				break;

			case 'neu':
				await Logic.neu(interaction);
				break;

			case 'ct':
				await Logic.ct(interaction);
				break;

			case 'soopy':
				await Logic.soopy(interaction);
				break;

			case 'drm':
				await Logic.drm(interaction);
				break;

			case 'dulkir':
				await Logic.dulkir(interaction);
				break;

			case 'sh':
				await Logic.sh(interaction);
				break;

			case 'sbe':
				await Logic.sbe(interaction);
				break;

			case 'cult':
				await Logic.cult(interaction);
				break;

			case 'fcouncil':
				await Logic.fcouncil(interaction);
				break;

			case 'elitef':
				await Logic.elitef(interaction);
				break;

			// sEvents

			case 'eventA':
				await Logic.eventA(interaction);
				break;

			case 'eventA_start':
				await Logic.eventA_start(interaction);
				break;
			}
		}

		else if (interaction.isModalSubmit()) {
			const modals = interaction.customId;

			switch (modals) {
			case 'linkM':
				await Logic.linkLogic(interaction);
				break;
			}
		}

		else { return; }
	}
};