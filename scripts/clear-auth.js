#!/usr/bin/env node

// Script to clear stored authentication data and force fresh login
// This is useful when switching from mock to real backend

console.log("🔄 Clearing stored authentication data...");

// Instructions for manual clearing (since we can't access localStorage from Node.js)
console.log(`
📋 Manual steps to clear authentication:

1. Open your browser's Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear the following localStorage items:
   - jdmarc_token
   - jdmarc_user
   - jdmarc_last_login

4. Or run this in browser console:
   localStorage.removeItem("jdmarc_token");
   localStorage.removeItem("jdmarc_user");
   localStorage.removeItem("jdmarc_last_login");
   window.location.reload();

✅ After clearing, you'll need to login with real backend credentials.

🔗 Backend API URL: http://localhost:5000/api
📡 Environment: Production mode (using real backend)

Make sure your backend server is running on port 5000!
`);
