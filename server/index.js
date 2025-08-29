import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB, createUser, getAllUsers, updateUserById, deleteUser } from '../src/lib/mongodb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectMongoDB().catch(console.error);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User management routes
app.post('/api/users', async (req, res) => {
  try {
    const result = await createUser(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await updateUserById(req.params.id, req.body);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

// Processing endpoint (existing)
app.post('/api/check', (req, res) => {
  const { data } = req.body;
  
  // Simple validation logic
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
  const hasValidDomain = data.includes('.com') || data.includes('.org') || data.includes('.net');
  
  const approved = isEmail && hasValidDomain;
  
  res.json({
    status: approved ? 'approved' : 'rejected',
    message: approved ? 'Valid email format' : 'Invalid format or domain',
    approved
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});