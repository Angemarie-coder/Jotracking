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

async function verifyUser() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Update the user to be verified
    const [updatedRows] = await sequelize.query(
      "UPDATE users SET \"isVerified\" = true WHERE email = 'fixed@test.com'"
    );
    
    console.log('Updated rows:', updatedRows);
    
    // Check if user exists and is verified
    const [users] = await sequelize.query(
      "SELECT id, email, \"isVerified\", \"firstName\", \"lastName\" FROM users WHERE email = 'fixed@test.com'"
    );
    
    console.log('User found:', users[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyUser(); 