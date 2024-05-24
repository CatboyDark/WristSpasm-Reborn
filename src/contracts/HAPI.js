const HypixelAPIReborn = require('hypixel-api-reborn');
const { HAPI } = require('../../auth.json');

const hypixel = new HypixelAPIReborn.Client(HAPI, {
	cache: true,
});

module.exports = hypixel;