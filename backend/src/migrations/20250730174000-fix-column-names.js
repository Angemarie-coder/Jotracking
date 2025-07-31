'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Rename columns in users table
      await queryInterface.sequelize.query(
        `ALTER TABLE users 
         RENAME COLUMN "firstName" TO "first_name",
         RENAME COLUMN "lastName" TO "last_name",
         RENAME COLUMN "isVerified" TO "is_verified",
         RENAME COLUMN "verificationToken" TO "verification_token",
         RENAME COLUMN "verificationTokenExpires" TO "verification_token_expires",
         RENAME COLUMN "createdAt" TO "created_at",
         RENAME COLUMN "updatedAt" TO "updated_at"`,
        { transaction }
      );

      // Rename columns in jobs table
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs 
         RENAME COLUMN "appliedDate" TO "applied_date",
         RENAME COLUMN "userId" TO "user_id",
         RENAME COLUMN "createdAt" TO "created_at",
         RENAME COLUMN "updatedAt" TO "updated_at"`,
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
      // Revert changes in users table
      await queryInterface.sequelize.query(
        `ALTER TABLE users 
         RENAME COLUMN "first_name" TO "firstName",
         RENAME COLUMN "last_name" TO "lastName",
         RENAME COLUMN "is_verified" TO "isVerified",
         RENAME COLUMN "verification_token" TO "verificationToken",
         RENAME COLUMN "verification_token_expires" TO "verificationTokenExpires",
         RENAME COLUMN "created_at" TO "createdAt",
         RENAME COLUMN "updated_at" TO "updatedAt"`,
        { transaction }
      );

      // Revert changes in jobs table
      await queryInterface.sequelize.query(
        `ALTER TABLE jobs 
         RENAME COLUMN "applied_date" TO "appliedDate",
         RENAME COLUMN "user_id" TO "userId",
         RENAME COLUMN "created_at" TO "createdAt",
         RENAME COLUMN "updated_at" TO "updatedAt"`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
