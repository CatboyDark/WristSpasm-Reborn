const { createMsg, createRow, createModal } = require('../../../helper/builder.js');
const { readConfig, getPlayer, getGuild } = require('../../../helper/utils.js');
const { Inactivity, Link } = require('../../../mongo/schemas.js');
const { getPurge } = require('./getGXP.js');

const config = readConfig();

function genID() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dateString = `${year}${month}`;

    const periodIndex = Math.floor((date.getDate() - 1) / 14);
    const suffix = String.fromCharCode(65 + periodIndex);

    return `${dateString}${suffix}`;
}

function genTimestamp() {
    const now = Date.now();
    const futureTimestamp = now + (48 * 60 * 60 * 1000);
    const futureTimestampSeconds = Math.floor(futureTimestamp / 1000);

    const dTimestamp = `<t:${futureTimestampSeconds}:R>`;

    return dTimestamp;
}

const maxLength = 4096;

const splitDescription = (text) => {
    const parts = [];
    for (let i = 0; i < text.length; i += maxLength) {
        parts.push(text.substring(i, i + maxLength));
    }
    return parts;
};

async function sendStaffInactivityNotif(client) {
    const purgeID = genID();
    const channel = client.channels.cache.get('1070774833916424253');

    const purgeList = await getPurge(client);

    const chunks = [];
    for (let i = 0; i < purgeList.length; i += 50) {
        chunks.push(purgeList.slice(i, i + 50));
    }

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];
        let ignList = '';
        let gxpList = '';

        for (const member of chunk) {
            ignList += `${member.ign.replace(/_/g, '\\_')}\n`;
            gxpList += `${member.gxp}\n`;
        }

        const ignListChunks = splitDescription(ignList);
        const gxpListChunks = splitDescription(gxpList);

        for (let i = 0; i < ignListChunks.length; i++) {
            const embedOptions = {
                fields: [
                    { title: 'IGN', desc: ignListChunks[i], inline: true },
                    { title: 'GXP', desc: gxpListChunks[i], inline: true }
                ],
                icon: config.icon,
                footer: `Purge ID: ${purgeID}`,
                footerIcon: 'https://raw.githubusercontent.com/CatboyDark/WristSpasm-Reborn/main/assets/wristspazm.png'
            };

            if (i === 0 && chunkIndex === 0) {
                embedOptions.title = 'Purge Notification';
                embedOptions.desc = '**A DM has been sent to the following members!**';
            }

            const embed = createMsg(embedOptions);
            await channel.send({ embeds: [embed] });
        }
    }
}

async function sendInactivityNotif(client) {
    const purgeID = genID();
    const timestamp = genTimestamp();

    const inactivityMsg = createMsg({
        title: 'WristSpasm',
        desc:
            `**You are at risk of being purged ${timestamp}.**\n\n` +
            'You have not met our **50k** weekly GXP requirement!\n' +
            'If you are unable to play, please submit an inactivity request.\n\n_ _',
        footer: `Purge ID: ${purgeID}`,
        footerIcon: 'https://i.imgur.com/uwqAaeb.png'
    });

    const buttons = createRow([
        { id: 'checkGXP', label: 'Check your GXP', style: 'Green' },
        { id: 'inactivityRequest', label: 'Submit an Inactivity Request', style: 'Green' }
    ]);

    try {
        const linkedPlayers = await Link.find({});
        const map = new Map(linkedPlayers.map(player => [player.uuid, player.dcid]));

        const inactivityList = await getPurge(client);

        for (const member of inactivityList) {
            const dcid = map.get(member.uuid);
            if (dcid) {
            	const user = await client.users.fetch(dcid);
                await user.send({ embeds: [inactivityMsg], components: [buttons] }).catch(sendError => {
                    if (sendError.code === 50007) console.warn(`${user.username} has DMs off!`);
                });
            }
    	}
    }
    catch (error) {
        console.error('Error sending inactivity notifications:', error);
    }
    console.log('Inactivity notifications sent!');
}

async function checkGXP(interaction) {
    const i = await Link.findOne({ dcid: interaction.user.id }).exec();
    const player = await getPlayer(i.uuid);
    const guild = await getGuild('player', i.uuid);
    const member = guild.members.find(m => m.uuid === i.uuid);
    const gxp = member.weeklyExperience;

    let fGXP;
    if (gxp >= 1000) fGXP = `${(gxp / 1000).toFixed(1)}k`;
    else fGXP = gxp.toString();

    interaction.reply({ embeds: [createMsg({ title: 'WristSpasm', desc: `${player.nickname}'s Weekly GXP: **${fGXP}**` })], ephemeral: true });
}

async function inactivityRequest(interaction) {
    if (interaction.isButton()) {
        const modal = createModal({
            id: 'inactivityRequestForm',
            title: 'Submit an Inactivity Request',
            components: [{
                id: 'reason',
                label: 'ENTER YOUR REASON:',
                style: 'long',
                required: true
            }]
        });

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit()) {
        const purgeID = genID();
        const reason = interaction.fields.getTextInputValue('reason');

        const existingRequest = await Inactivity.findOne({ dcid: interaction.user.id });

        if (existingRequest) return interaction.reply({ embeds: [createMsg({ desc: '**You have already submitted an inactivity request!**' })], ephemeral: true });

        const newInactivity = new Inactivity({ dcid: interaction.user.id, reason });
        await newInactivity.save();

        await interaction.reply({ embeds: [createMsg({
            title: 'WristSpasm',
            desc:
				'**Your inactivity request has been submitted!**\n' +
				`**Reason:** ${reason}\n\n` +

				'**You will not be purged this week.** :thumbsup:\n\n_ _',
            footer: `Purge ID: ${purgeID}`,
            footerIcon: 'https://raw.githubusercontent.com/CatboyDark/WristSpasm-Reborn/main/assets/wristspazm.png'
        })] });
    }
}

module.exports =
{
    sendStaffInactivityNotif,
    sendInactivityNotif,
    checkGXP,
    inactivityRequest
};
