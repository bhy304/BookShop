const pool = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const allCategory = async (req, res) => {
  try {
    const connection = await pool.getConnection()

    const [results] = await connection.query('SELECT * FROM category')
    connection.release()

    return res.status(StatusCodes.OK).json(results)
  } catch (error) {
    console.log(error)
    connection.release()
    return res.status(StatusCodes.BAD_REQUEST).end()
  }
}

module.exports = { allCategory }
