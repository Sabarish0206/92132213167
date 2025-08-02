import express from 'express';
import dotenv from 'dotenv';
import shortenerRoutes from './routes/shortener.js';
import logRoute from './routes/logRoute.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// MongoDB Connection
const MONGO_URI = 'mongodb+srv://test_username:g3yzYKMyPvBUa4Lr@cluster0.1ormubv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
await mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('✅ Connected to MongoDB Atlas');

app.use('/shorten', shortenerRoutes); 
app.use('/log', logRoute);         

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
