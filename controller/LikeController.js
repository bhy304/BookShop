const pool = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const verifyToken = require('../utils/authorize')
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')

const addLike = async (req, res) => {
  const authorization = verifyToken(req, res)
  const liked_book_id = req.params.id

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    })
  }

  try {
    const connection = await pool.getConnection()
    const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)'
    const results = await connection.query(sql, [
      authorization.id,
      liked_book_id,
    ])
    connection.release()
    return res.status(StatusCodes.OK).json(results)
  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.BAD_REQUEST).end()
  }
}

const removeLike = async (req, res) => {
  const authorization = verifyToken(req, res)
  const liked_book_id = req.params.id

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    })
  }

  try {
    const connection = await pool.getConnection()
    const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?'
    const results = await connection.query(sql, [
      authorization.id,
      liked_book_id,
    ])
    connection.release()
    return res.status(StatusCodes.OK).json(results)
  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.BAD_REQUEST).end()
  }
}

module.exports = { addLike, removeLike }
