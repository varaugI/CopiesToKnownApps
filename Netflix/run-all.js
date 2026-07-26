import { spawn } from 'child_process';
import path from 'path';

const rootDir = process.cwd();

console.log('====================================================');
console.log('🍿 Launching StreamFlix Full-Stack Ecosystem...');
console.log('====================================================\n');

// 1. Start Node.js API Server
const server = spawn('npm', ['start'], {
  cwd: path.join(rootDir, 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Start React Netflix Client
const reactApp = spawn('npm', ['run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// 3. Start Angular Netflix Client
const angularApp = spawn('npm', ['start'], {
  cwd: path.join(rootDir, 'angular-app'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down StreamFlix ecosystem services...');
  server.kill();
  reactApp.kill();
  angularApp.kill();
  process.exit();
});
