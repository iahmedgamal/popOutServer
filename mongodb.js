require('dotenv').config();  

const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL; 
const dbName = 'popOutSmartDB'; 

const client = new MongoClient(url);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName); 
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

module.exports = connect;
