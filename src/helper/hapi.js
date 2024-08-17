const { Client } = require('hypixel-api-reborn');
const config = require('../../config.json');

const client = new Client(config.hypixelAPI, { cache: true });

module.exports = client;