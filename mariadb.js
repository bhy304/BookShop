// const mariadb = require('mysql2')

// const connection = mariadb.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   dateStrings: true,
// })

// module.exports = connection

const mariadb = require('mysql2/promise')

const getConnection = () => {
  return mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: true,
  })
}

module.exports = getConnection
