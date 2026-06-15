import axios from 'axios';

async function testAdminLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@smartlab.com',
      password: 'admin123'
    });
    console.log('Login success:', res.data);
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
  }
}

testAdminLogin();
