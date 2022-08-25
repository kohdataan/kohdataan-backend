'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Interests',
      [
        {
          name: 'Lukeminen',
        },
        {
          name: 'Politiikka',
        },
        {
          name: 'Historia',
        },
        {
          name: 'Käsityöt',
        },
        {
          name: 'Pelaaminen',
        },
        {
          name: 'Valokuvaus',
        },
      ],
      {}
    )
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Interests', null, {})
  },
}
