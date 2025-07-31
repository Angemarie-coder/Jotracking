'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // First, check if the uppercase tables exist and have data
      const usersExist = await queryInterface.sequelize.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Users') as exists",
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      const jobsExist = await queryInterface.sequelize.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Jobs') as exists",
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      // If uppercase Users table exists and has data, migrate it to lowercase
      if (usersExist[0].exists) {
        await queryInterface.sequelize.query(
          `INSERT INTO users (id, first_name, last_name, email, password, is_verified, verification_token, verification_token_expires, created_at, updated_at)
           SELECT id, "firstName", "lastName", email, password, "isVerified", "verificationToken", "verificationTokenExpires", "createdAt", "updatedAt"
           FROM "Users"
           ON CONFLICT (id) DO NOTHING`,
          { transaction }
        );
        
        // Drop the uppercase Users table
        await queryInterface.dropTable('Users', { transaction });
      }

      // If uppercase Jobs table exists and has data, migrate it to lowercase
      if (jobsExist[0].exists) {
        await queryInterface.sequelize.query(
          `INSERT INTO jobs (id, title, company, description, location, url, salary, status, applied_date, notes, user_id, created_at, updated_at)
           SELECT id, title, company, description, location, url, salary, status, "appliedDate", notes, "userId", "createdAt", "updatedAt"
           FROM "Jobs"
           ON CONFLICT (id) DO NOTHING`,
          { transaction }
        );
        
        // Drop the uppercase Jobs table
        await queryInterface.dropTable('Jobs', { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // This migration cannot be safely rolled back
    console.warn('This migration cannot be rolled back automatically');
  }
};
