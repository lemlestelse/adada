import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription_days: {
    type: Number,
    default: 30
  },
  allowed_ips: [{
    type: String
  }],
  is_banned: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
userSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const UserModel = mongoose.model('User', userSchema);

// Connection function
export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/terramail';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// User operations
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  subscription_days?: number;
  allowed_ips?: string[];
}

export const createUser = async (userData: CreateUserData) => {
  try {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = new UserModel({
      name: userData.name,
      email: userData.email,
      password_hash: hashedPassword,
      role: userData.role || 'user',
      subscription_days: userData.subscription_days || 30,
      allowed_ips: userData.allowed_ips || []
    });

    await user.save();
    return { success: true, user: user.toObject() };
  } catch (error: any) {
    if (error.code === 11000) {
      return { success: false, error: 'Email already exists' };
    }
    return { success: false, error: error.message };
  }
};

export const getAllUsers = async () => {
  try {
    const users = await UserModel.find({}).sort({ created_at: -1 });
    return users.map(user => user.toObject());
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUserById = async (userId: string, updates: any) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { ...updates, updated_at: new Date() },
      { new: true }
    );
    return user ? user.toObject() : null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await UserModel.findByIdAndDelete(userId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
};