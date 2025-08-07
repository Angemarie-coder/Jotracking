'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Rename columns in users table - one at a time
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "firstName" TO "first_name"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "lastName" TO "last_name"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "isVerified" TO "is_verified"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "verificationToken" TO "verification_token"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "verificationTokenExpires" TO "verification_token_expires"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "createdAt" TO "created_at"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "updatedAt" TO "updated_at"`,
        { transaction }
      );

      // Rename columns in jobs table - one at a time
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "appliedDate" TO "applied_date"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "userId" TO "user_id"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "createdAt" TO "created_at"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "updatedAt" TO "updated_at"`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Revert changes in users table - one at a time
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "first_name" TO "firstName"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "last_name" TO "lastName"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "is_verified" TO "isVerified"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "verification_token" TO "verificationToken"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "verification_token_expires" TO "verificationTokenExpires"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "created_at" TO "createdAt"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "updated_at" TO "updatedAt"`,
        { transaction }
      );

      // Revert changes in jobs table - one at a time
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "applied_date" TO "appliedDate"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "user_id" TO "userId"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "created_at" TO "createdAt"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs RENAME COLUMN "updated_at" TO "updatedAt"`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
