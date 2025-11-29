// Simple script to test backend connectivity
const backendUrl = process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:8000';

console.log('Testing backend connectivity...');
console.log('Backend URL:', backendUrl);

// Test basic connectivity
fetch(`${backendUrl}/docs`)
  .then(response => {
    console.log('Docs endpoint status:', response.status);
    return response.text();
  })
  .then(data => {
    console.log('Docs endpoint accessible:', data.includes('FastAPI') || data.includes('swagger'));
  })
  .catch(error => {
    console.error('Backend connectivity error:', error.message);
  });

// Test UPSC endpoint
fetch(`${backendUrl}/upsc/evaluate`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer test-token'
  }
})
  .then(response => {
    console.log('UPSC evaluate endpoint status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('UPSC evaluate response:', data);
  })
  .catch(error => {
    console.error('UPSC endpoint error:', error.message);
  });
