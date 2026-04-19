const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'name email role status');
    console.log('--- USER DIAGNOSTICS ---');
    console.table(users.map(u => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Status: u.status
    })));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkUsers();
