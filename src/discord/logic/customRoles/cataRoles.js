const { createMsg, createRow, createModal, createError } = require('../../../helper/builder.js');
const { readConfig, writeConfig, toggleConfig } = require('../../../helper/utils.js');

const invalidCata = createError('**That\'s not a valid Cata level!**');
const invalidRole = createError('**That\'s not a valid Role ID!**');

function createCataRolesMsg() 
{
	const config = readConfig();
	if (Object.keys(config.cataRoles).length === 0) 
		return createMsg({ title: 'Custom Roles: Cata', desc: 'You may assign a role to any Catacombs level.' });

	const roleList = Object.entries(config.cataRoles)
		.map(([level, roleID]) => `<@&${roleID}> - **Cata ${level}**`)
		.join('\n');

	return createMsg({ title: 'Custom Roles: Cata', desc: `You may assign a role to any Catacombs level.\n### Roles:\n${roleList}` });
}

const row1 = createRow([
	{ id: 'createCataRoles', label: 'Create Role', style: 'Green' },
	{ id: 'deleteCataRoles', label: 'Remove Role', style: 'Red' }
]);

function createRow2()
{
	const config = readConfig();
	const back = createRow([
		{ id: 'customRoles', label: 'Back', style: 'Gray' },
		{ id: 'cataRolesToggle', label: 'Enable Cata Roles', style: config.features.cataRolesToggle }
	]);

	return back;
}

async function cataRoles(interaction)
{
	await interaction.update({ embeds: [createCataRolesMsg()], components: [row1, createRow2()] });
}

async function cataRolesToggle(interaction)
{
	await toggleConfig('features.cataRolesToggle');
	await cataRoles(interaction);
}

async function createCataRoles(interaction)
{
	if (interaction.isButton()) 
	{
		const modal = createModal({
			id: 'createCataRolesForm',
			title: 'Create Cata Role',
			components: [
				{
					id: 'cataInput',
					label: 'ENTER A CATA LEVEL (0-50):',
					style: 'short',
					required: true
				},
				{
					id: 'cataRoleInput',
					label: 'ENTER A ROLE ID:',
					style: 'short',
					required: true
				}
			]
		});
		
		await interaction.showModal(modal);
	}

	if (interaction.isModalSubmit())
	{
		const cataInput = interaction.fields.getTextInputValue('cataInput');
		const cataRole = interaction.fields.getTextInputValue('cataRoleInput');

		if (cataInput < 0 || cataInput > 50) return interaction.reply({ embeds: [invalidCata], ephemeral: true });
		const role = interaction.guild.roles.cache.get(cataRole);
		if (!role) return interaction.reply({ embeds: [invalidRole], ephemeral: true });

		const config = readConfig();
		config.cataRoles[cataInput] = cataRole;
		writeConfig(config);

		await cataRoles(interaction);
	}
}

async function deleteCataRoles(interaction)
{
	if (interaction.isButton()) 
	{
		const modal = createModal({
			id: 'deleteCataRolesForm',
			title: 'Remove Cata Role',
			components: [{
				id: 'cataRemoveInput',
				label: 'ENTER A CATA TO REMOVE (0-50):',
				style: 'short',
				required: true
			}]
		});
			
		await interaction.showModal(modal);
	}

	if (interaction.isModalSubmit())
	{
		const cataRemoveInput = interaction.fields.getTextInputValue('cataRemoveInput');

		const config = readConfig();
        
		if (cataRemoveInput >= 0 || cataRemoveInput <= 50)
		{
			if (config.cataRoles[cataRemoveInput]) 
			{
				delete config.cataRoles[cataRemoveInput];
				writeConfig(config);
			}
			else return interaction.reply({ embeds: [createError(`You don\'t have a role set for **Catacombs Level ${cataRemoveInput}**!`)], ephemeral: true });

			await cataRoles(interaction);
		}

		else return interaction.reply({ embeds: [invalidCata], ephemeral: true });
	}
}

module.exports =
{
	cataRoles,
	createCataRoles,
	deleteCataRoles,
	cataRolesToggle
};