const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const addLike = (req, res) => {
  const { id } = req.params
  const { user_id } = req.body

  const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);'

  connection.query(sql, [user_id, id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

const removeLike = (req, res) => {
  const sql = ''

  res.json('좋아요 삭제')
}

module.exports = { addLike, removeLike }
