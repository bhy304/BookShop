const connection = require('../mariadb')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const addLike = (req, res) => {
  const { id } = req.params

  const token = req.headers['authorization']
  console.log(token)

  let decoded = jwt.verify(token, process.env.PRIVATE_KEY)
  console.log(decoded)

  const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)'

  connection.query(sql, [decoded.id, id], (err, results) => {
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
