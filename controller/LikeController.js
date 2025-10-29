const connection = require('../mariadb')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const addLike = (req, res) => {
  const authorizetion = authorize(req)
  const liked_book_id = req.params.id

  const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)'

  connection.query(sql, [authorizetion.id, liked_book_id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

const removeLike = (req, res) => {
  const authorizetion = authorize(req)
  const liked_book_id = req.params.id

  const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?'

  connection.query(sql, [authorizetion.id, liked_book_id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

const authorize = (req) => {
  const token = req.headers['authorization']
  const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
  return decoded
}

module.exports = { addLike, removeLike }
