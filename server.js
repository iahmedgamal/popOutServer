const fastify = require('fastify')();
const fastifyCors = require('@fastify/cors');  
const { MongoClient, ObjectId } = require('mongodb');  
require('dotenv').config(); 

let db;

// Register the CORS plugin
fastify.register(fastifyCors, {
  origin: "*",  // Allow all origins I should add the FE URL here
  methods: ["GET", "POST"], 
  allowedHeaders: ["Content-Type"], 
  credentials: true, 
});

// MongoDB connection
const connect = async () => {
  const url = process.env.MONGODB_URL ; 
  const client = new MongoClient(url);
  try {
    await client.connect();
    db = client.db('weatherDB');  
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

// Initialize MongoDB connection
connect();

// save data to MongoDB
fastify.post('/save-weather', async (request, reply) => {
  const weatherData = request.body;

  try {
    const collection = db.collection('weatherData');  
    const result = await collection.insertOne(weatherData);  
    return { success: true, insertedId: result.insertedId };
  } catch (err) {
    console.error('Failed to save data:', err);
    return { success: false, message: 'Error saving data' };
  }
});

// Endpoint to retrieve data from MongoDB by ID
fastify.get('/weather/:id', async (request, reply) => {
  const { id } = request.params;

  try {
    const collection = db.collection('weatherData');
    const weather = await collection.findOne({ _id: new ObjectId(id) }); 
    if (!weather) {
      return { success: false, message: 'Weather data not found' };
    }
    return { success: true, weather };
  } catch (err) {
    console.error('Error retrieving data:', err);
    return { success: false, message: 'Error retrieving data' };
  }
});

// Start the Fastify server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
