const fastify = require('fastify')();
const fastifyCors = require('@fastify/cors');
const connectToDb = require('./mongodb');  
require('dotenv').config();

fastify.register(fastifyCors, {
  origin: process.env.FRONTEND_URL,  
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type'],
  credentials: true,
});

fastify.get('/', async (request, reply) => {
    return { itWorks: 'it works' };
});

fastify.post('/save-weather', async (request, reply) => {
  const weatherData = request.body;

  try {
    const db = await connectToDb();  
    console.log(db)
    const collection = db.collection('weatherData');
    const result = await collection.insertOne(weatherData);

    return reply.status(200).send({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error('Failed to save data:', err);
    return reply.status(500).send({ success: false, message: 'Error saving data' });
  }
});

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

module.exports = fastify;
