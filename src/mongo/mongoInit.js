const mongoose = require('mongoose');
const { mongoURI } = require('../../config.json');

class Mongo 
{
	constructor() 
	{
		this.URI = mongoURI;
	}

	async connect() 
	{
		try 
		{
			await mongoose.connect(this.URI);
			console.log('ErisDB is online!');
		} 
		catch (error) 
		{
			console.error('Error connecting to MongoDB:', error);
			process.exit(1);
		}
	}

	static async create() 
	{
		const mongo = new Mongo();
		await mongo.connect();
		return mongo;
	}
}

module.exports = async function() 
{
	return await Mongo.create();
};