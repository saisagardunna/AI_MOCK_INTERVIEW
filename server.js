const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'interviewDB' });
    console.log('Connected to MongoDB');
    const Interview = mongoose.model('Interview', new mongoose.Schema({}));
    const interviews = await Interview.find();
    console.log('Interviews in DB:', JSON.stringify(interviews, null, 2));
    console.log('User IDs in DB:', [...new Set(interviews.map(i => i.userId))]);
    await mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

testMongoDB();