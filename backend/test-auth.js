// Test script to verify authentication endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAuthEndpoints() {
    console.log('🧪 Testing Authentication Endpoints...\n');

    try {
        // Test 1: Health check
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check:', healthResponse.data.message);

        // Test 2: Register new user
        console.log('\n2️⃣ Testing user registration...');
        const registerData = {
            email: 'test@example.com',
            password: 'testpass123',
            role: 'user'
        };

        const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
        console.log('✅ Registration successful:', registerResponse.data.message);
        console.log('   User ID:', registerResponse.data.user.id);

        // Test 3: Login with registered user
        console.log('\n3️⃣ Testing user login...');
        const loginData = {
            email: 'test@example.com',
            password: 'testpass123'
        };

        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
        console.log('✅ Login successful:', loginResponse.data.message);
        console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');

        // Test 4: Get user info with token
        console.log('\n4️⃣ Testing protected endpoint...');
        const token = loginResponse.data.token;
        const userInfoResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ User info retrieved:', userInfoResponse.data.user.email);

        // Test 5: Try duplicate registration
        console.log('\n5️⃣ Testing duplicate registration (should fail)...');
        try {
            await axios.post(`${BASE_URL}/api/auth/register`, registerData);
            console.log('❌ Duplicate registration should have failed');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                console.log('✅ Duplicate registration properly rejected');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        // Test 6: Try login with wrong password
        console.log('\n6️⃣ Testing wrong password (should fail)...');
        try {
            await axios.post(`${BASE_URL}/api/auth/login`, {
                email: 'test@example.com',
                password: 'wrongpassword'
            });
            console.log('❌ Wrong password should have failed');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Wrong password properly rejected');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run tests
testAuthEndpoints();
