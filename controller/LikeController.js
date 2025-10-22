const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const addLike = (req, res) => {
  const { id } = req.params
  const { user_id } = req.body

  const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)'

  connection.query(sql, [user_id, id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

const removeLike = (req, res) => {
  const { id } = req.params
  const { user_id } = req.body

  const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?'

  connection.query(sql, [user_id, id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

module.exports = { addLike, removeLike }
