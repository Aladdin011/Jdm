const https = require('https');

// Test CORS preflight request
const testCORS = () => {
  const options = {
    hostname: 'jdmarc-backend-api.onrender.com',
    port: 443,
    path: '/api/cors-test',
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://jdmarcng.com',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  };

  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    res.on('data', (chunk) => {
      console.log('Response:', chunk.toString());
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e);
  });

  req.end();
};

// Test root endpoint
const testRoot = () => {
  const options = {
    hostname: 'jdmarc-backend-api.onrender.com',
    port: 443,
    path: '/',
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    console.log('Root Status:', res.statusCode);
    console.log('Root Headers:', res.headers);
    
    res.on('data', (chunk) => {
      console.log('Root Response:', chunk.toString());
    });
  });

  req.on('error', (e) => {
    console.error('Root Error:', e);
  });

  req.end();
};

console.log('Testing CORS...');
testCORS();

setTimeout(() => {
  console.log('\nTesting root endpoint...');
  testRoot();
}, 1000);
