const { createMsg, createError } = require('../../../helper/builder.js');
const { readConfig } = require('../../../helper/utils.js');
const { getGXP } = require('../../logic/GXP/getGXP.js');

const maxLength = 1024;

const invalidThreshold = createError('**Invalid threshold.** Please provide a number (\'**50000**\' or \'**50k**\').');

function splitMsg(array, maxLength) {
    const result = [];
    let chunk = '';
    for (const item of array) {
        if ((chunk + item).length > maxLength) {
            result.push(chunk);
            chunk = `${item}\n`;
        }
        else {
            chunk += `${item}\n`;
        }
    }
    if (chunk) result.push(chunk);
    return result;
}

module.exports = {
    name: 'gxplist',
    desc: 'Displays GXP list',
    options: [
        { type: 'integer', name: 'days', desc: 'Filter GXP obtained in the last x days (Default: 7)' },
        { type: 'string', name: 'gxp', desc: 'Filter members by GXP below this threshold (\'50000\' or \'50k\')' },
        { type: 'integer', name: 'join_date', desc: 'Filter members who joined more than x days ago' }
    ],

    async execute(interaction) {
        const limitInput = interaction.options.getInteger('days') || 7;
        const thresholdInput = interaction.options.getString('gxp');
        const joinDateInput = interaction.options.getInteger('join_date');

        let threshold = null;
        let beforeJoinDate = null;

        if (thresholdInput) {
            const thresholdMatch = thresholdInput.match(/^(\d+)(k)?$/i);
            if (thresholdMatch) {
                threshold = parseInt(thresholdMatch[1], 10);
                if (thresholdMatch[2]) threshold *= 1000;
            }
            else {
                return interaction.reply({ embeds: [invalidThreshold], ephemeral: true });
            }
        }

        if (joinDateInput !== null) {
            const currentDate = new Date();
            beforeJoinDate = new Date(currentDate.setDate(currentDate.getDate() - joinDateInput));
        }

        await interaction.deferReply();

        const config = readConfig();
        const success = await interaction.followUp({ embeds: [createMsg({ title: config.guild, desc: '**Gathering data...**', icon: config.icon })] });

        let gxp = await getGXP(interaction.client);

        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - limitInput);

        if (threshold !== null) gxp = gxp.filter(member => member.gxp < threshold);
        if (beforeJoinDate !== null) gxp = gxp.filter(member => new Date(member.joinDate) < beforeJoinDate);

        await success.delete();

        const ignGxpPairs = gxp.map(member => `${member.ign.replace(/_/g, '\\_')} ${member.gxp}`);
        const chunks = splitMsg(ignGxpPairs, maxLength);

        const formattedDays = `- **Last ${limitInput} Days**`;
        const formattedThreshold = thresholdInput !== null ? `- **Below ${Math.floor(threshold / 1000)}k**` : '';
        const formattedJoinDate = joinDateInput !== null ? `- **Joined ${joinDateInput}+ Days Ago**` : '';
        const embedDesc = [formattedDays, formattedThreshold, formattedJoinDate].filter(Boolean).join('\n');

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const splitLines = chunk.split('\n').filter(line => line.trim());
            const ignList = splitLines.map(line => line.split(' ')[0]).join('\n');
            const gxpList = splitLines.map(line => line.split(' ')[1]).join('\n');

            const embed = createMsg({
                title: i === 0 ? 'GXP List' : undefined,
                desc: i === 0 ? embedDesc : undefined,
                icon: config.icon,
                fields: [
                    { title: 'IGN', desc: ignList, inline: true },
                    { title: 'GXP', desc: gxpList, inline: true }
                ]
            });

            await interaction.channel.send({ embeds: [embed] });
        }
    }
};
