#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Password Hash Generator for NeuroExpert Admin');
console.log('================================================\n');

rl.question('Enter the admin password to hash: ', async (password) => {
  if (!password || password.length < 8) {
    console.error('\n❌ Error: Password must be at least 8 characters long');
    rl.close();
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    
    console.log('\n✅ Password hashed successfully!\n');
    console.log('Add this to your .env file:');
    console.log('----------------------------');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('----------------------------\n');
    console.log('⚠️  Remember to keep your .env file secure and never commit it to git!');
    
  } catch (error) {
    console.error('\n❌ Error hashing password:', error);
  }
  
  rl.close();
});