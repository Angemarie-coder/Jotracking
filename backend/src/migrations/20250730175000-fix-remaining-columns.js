'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Rename remaining camelCase columns in users table
      await queryInterface.sequelize.query(
        `ALTER TABLE users RENAME COLUMN "isAdmin" TO "is_admin"`,
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
        `ALTER TABLE users RENAME COLUMN "is_admin" TO "isAdmin"`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
