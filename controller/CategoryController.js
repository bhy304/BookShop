const getConnection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const allCategory = async (req, res) => {
  try {
    const connection = await getConnection()

    const [results] = await connection.query('SELECT * FROM category')

    return res.status(StatusCodes.OK).json(results)
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).end()
  }
}

module.exports = { allCategory }
