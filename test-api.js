const mongoose = require('mongoose');

async function testMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'interviewDB' });
    console.log('Connected to MongoDB');
    const Interview = mongoose.model('Interview', new mongoose.Schema({}, { strict: false }));
    const interviews = await Interview.find();
    console.log('Interviews in DB:', JSON.stringify(interviews, null, 2));
    console.log('User IDs in DB:', [...new Set(interviews.map(i => i.userId))]);
    await mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

async function testInterviewsAPI() {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('http://localhost:3000/api/interview', { // Changed to /api/interview
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Response status:', response.status, response.statusText);
    const text = await response.text();
    console.log('Response body (truncated):', text.substring(0, 200));
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:', data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError.message);
    }
  } catch (error) {
    console.error('Error fetching /api/interview:', error.message);
  }
}

async function runTests() {
  await import('dotenv').then((dotenv) => dotenv.config({ path: '.env.local' }));
  await testMongoDB();
  await testInterviewsAPI();
}

runTests();