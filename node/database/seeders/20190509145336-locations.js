module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Interests',
      [
        {
          name: 'Eläimet',
        },
        {
          name: 'Matkustus',
        },
        {
          name: 'Urheilu',
        },
        {
          name: 'Luonto',
        },
        {
          name: 'Elokuvat',
        },
        {
          name: 'Ruoka',
        },
        {
          name: 'Tekniikka',
        },
        {
          name: 'Musiikki',
        },
        {
          name: 'Taide',
        },
      ],
      {}
    )
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Interests', null, {})
  },
}
