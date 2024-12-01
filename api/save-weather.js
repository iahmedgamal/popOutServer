const fastify = require('fastify')();
const fastifyCors = require('@fastify/cors');
const connectToDb = require('./mongodb');
require('dotenv').config();

fastify.register(fastifyCors, {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
});

// Test route
fastify.get('/', async (request, reply) => {
  return { message: 'Server is running locally or on Vercel' };
});

// Route to save weather data
fastify.post('/save-weather', async (request, reply) => {
  const weatherData = request.body;

  try {
    const db = await connectToDb();
    const collection = db.collection('weatherData');
    const result = await collection.insertOne(weatherData);

    return reply.status(200).send({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error('Failed to save data:', err);
    return reply.status(500).send({ success: false, message: 'Error saving data' });
  }
});

// Start server locally or export for Vercel
if (require.main === module) {
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
} else {
  // Export for Vercel
  module.exports = async (req, res) => {
    await fastify.ready();
    fastify.server.emit('request', req, res);
  };
}
