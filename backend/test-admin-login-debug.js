import axios from 'axios';

async function testAdminLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@smartlab.com',
      password: 'admin123'
    });
    console.log('Login success:', res.data);
  } catch (err) {
    console.error('Login failed:');
    console.error('message:', err.message);
    console.error('response status:', err.response?.status);
    console.error('response data:', err.response?.data);
    console.error('full error:', err.toString());
  }
}

testAdminLogin();
