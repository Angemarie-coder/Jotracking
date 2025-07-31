import connectDB from '../config/db';
import '../models/User.model';
import '../models/Job.model';

async function syncDatabase() {
  try {
    const sequelize = await connectDB();
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

syncDatabase();