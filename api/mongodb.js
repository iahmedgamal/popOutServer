require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

let db;

const connect = async () => {
  if (!db) {
    try {
      await client.connect();  
      db = client.db('weatherDB');  
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;  
    }
  }
  return db; 
};

module.exports = connect;
