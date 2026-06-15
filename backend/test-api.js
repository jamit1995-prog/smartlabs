import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing registration...');
    const registerRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Register response:', registerRes.data);

    console.log('\nTesting login...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginRes.data);
  } catch (error) {
    console.error('Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
    if (error.response?.data) {
      console.error('Full Error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAPI();
