const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'jobtracker',
  username: 'postgres',
  password: 'Ange1',
});

async function checkSchema() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table columns:');
    results.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();
