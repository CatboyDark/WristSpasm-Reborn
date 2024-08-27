const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
	command: { type: String, required: true, unique: true },
	count: { type: Number, default: 0 }
});

const buttonSchema = new mongoose.Schema({
	button: { type: String, required: true, unique: true },
	source: { type: String, default: '' },
	count: { type: Number, default: 0 }
});

const linkSchema = new mongoose.Schema({
	uuid: { type: String, required: true },
	dcid: { type: String, required: true }
}, { collection: 'playersLinked' });

linkSchema.index({ uuid: 1, dcid: 1 }, { unique: true });

const gxpSchema = new mongoose.Schema({
	uuid: { type: String, required: true, unique: true },
	entries: [{
		date: { type: String, required: true },
		gxp: { type: Number, required: true }
	}]
}, { collection: 'gxpLog' });

const inactivitySchema = new mongoose.Schema({
	dcid: { type: String, required: true },
	reason: { type: String, required: true }
}, { collection: 'inactivityList' });

const pinsSchema = new mongoose.Schema({
	channelId: { type: String, required: true, unique: true },
	pinnedMessages: { type: [String], default: [] }
}, { collection: 'serverPins' });

const Command = mongoose.model('Command', commandSchema);
const Button = mongoose.model('Button', buttonSchema);
const Link = mongoose.model('Link', linkSchema);
const GXP = mongoose.model('GXP', gxpSchema);
const Inactivity = mongoose.model('Inactivity', inactivitySchema);
const Pin = mongoose.model('Pin', pinsSchema);

module.exports = 
{
	Command,
	Button,
	Link,
	GXP,
	Inactivity,
	Pin
};