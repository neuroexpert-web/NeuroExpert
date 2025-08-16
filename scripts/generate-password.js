#!/usr/bin/env node

/**
 * Password Hash Generator for NeuroExpert
 * Usage: node scripts/generate-password.js [password]
 * Or: npm run generate:password -- [password]
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function generatePasswordHash(password) {
  if (!password) {
    // Generate a secure random password if none provided
    password = crypto.randomBytes(16).toString('base64').slice(0, 16);
    console.log(`🔐 Generated random password: ${password}`);
    console.log('⚠️  Save this password securely! You won\'t see it again.');
  }

  try {
    // Generate salt and hash
    const saltRounds = 12; // Higher than default for better security
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n📋 Password hash generated successfully!');
    console.log('Add this to your .env file:\n');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\n✅ This hash is safe to commit to version control.');
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    if (isValid) {
      console.log('✅ Hash verification successful!');
    } else {
      console.error('❌ Hash verification failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
    process.exit(1);
  }
}

// Get password from command line arguments
const password = process.argv[2];

if (!password) {
  console.log('🔐 NeuroExpert Password Hash Generator\n');
  console.log('Usage:');
  console.log('  node scripts/generate-password.js <password>');
  console.log('  npm run generate:password -- <password>');
  console.log('\nExample:');
  console.log('  npm run generate:password -- "my-secure-password-123"');
  console.log('\nOr run without password to generate a random one:');
  console.log('  npm run generate:password');
  console.log('');
  
  // Ask if user wants to generate random password
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Generate random password? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      generatePasswordHash();
    }
    readline.close();
  });
} else {
  generatePasswordHash(password);
}