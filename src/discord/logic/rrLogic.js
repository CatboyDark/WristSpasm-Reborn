const fs = require('fs');

module.exports = async (interaction) => 
{
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const data = JSON.parse(fs.readFileSync('data.json'));
    const roleId = data[interaction.message.embeds[0].description];
    const role = interaction.guild.roles.cache.get(roleId);

    // Require GUILD MEMBER role:
    // if (roleId === '1183240686678589541')
    // { if (!member.roles.cache.has(config.gmemberRole)) { return interaction.reply({ content: 'You must be a guild member to join our SMP!', ephemeral: true }); } }

    if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        await interaction.reply({ content: `${role} has been removed!`, ephemeral: true });
    } else {
        await member.roles.add(role);
        await interaction.reply({ content: `${role} has been added!`, ephemeral: true });
    }
};