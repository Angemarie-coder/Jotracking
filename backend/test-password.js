const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Ange1',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'jobtracker',
  logging: false,
});

async function testPassword() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Get the user's hashed password
    const [users] = await sequelize.query(
      "SELECT password FROM users WHERE email = 'fixed@test.com'"
    );
    
    if (users.length === 0) {
      console.log('User not found');
      return;
    }
    
    const hashedPassword = users[0].password;
    console.log('Hashed password from DB:', hashedPassword);
    
    // Test password comparison
    const testPassword = 'fixed123';
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    console.log('Password comparison result:', isValid);
    
    // Hash the same password to see what it should be
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('New hash for same password (salt rounds 10):', newHash);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPassword(); 