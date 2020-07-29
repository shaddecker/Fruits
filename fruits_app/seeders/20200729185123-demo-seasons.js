'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Seasons', [
        {
        name: 'Summer'
        },
        {
          name: 'Fall'
          },
          {
            name: 'Winter'
            },
            {
              name: 'Spring'
              },
    ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
