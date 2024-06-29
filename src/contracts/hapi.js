const { Client } = require('hypixel-api-reborn');
const { HAPI } = require('../../auth.json');

const client = new Client(HAPI, { cache: true });

module.exports = client;