const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const backend = path.join(root, 'backend');
if (!fs.existsSync(backend)) {
  console.log('No backend folder found.');
  process.exit(0);
}
const archive = path.join(root, `backend-archive-${Date.now()}`);
fs.renameSync(backend, archive);
console.log(`Moved backend -> ${archive}`);
