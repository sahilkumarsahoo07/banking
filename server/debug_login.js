const axios = require('axios');

async function debugLogin() {
  const loginData = {
    email: 'admin@bankcore.com',
    password: 'admin123'
  };

  console.log('--- Debugging Login (admin@bankcore.com) ---');
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
    console.log('SUCCESS:', res.status, res.data);
  } catch (err) {
    console.log('ERROR:', err.response?.status);
    console.log('MESSAGE:', err.response?.data);
  }

  // Try with another user if needed
}

debugLogin();
