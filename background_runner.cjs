const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'background_generator.log');
const out = fs.openSync(logFile, 'w');
const err = fs.openSync(logFile, 'a');

console.log('Spawning generator process in the background...');
const child = spawn('npx', ['tsx', 'generate_data.ts', '114', '100'], {
  detached: true,
  stdio: [ 'ignore', out, err ]
});

child.unref();
console.log('Spawning complete. Log file is at:', logFile);
process.exit(0);
