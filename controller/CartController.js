const getConnection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')
const verifyToken = require('../utils/authorize')

const addToCart = async (req, res) => {
  const authorization = verifyToken(req, res)
  const connection = await getConnection()
  const { book_id, quantity } = req.body

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    })
  } else {
    try {
      const sql =
        'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);'

      const [results] = await connection.query(sql, [
        book_id,
        quantity,
        authorization.id,
      ])

      return res.status(StatusCodes.OK).json(results)
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }
  }
}

// 장바구니 아이템 목록 조회
// (장바구니에서 선택한) 주문 “예상” 상품 목록 조회
const getCartItems = async (req, res) => {
  const connection = await getConnection()
  const authorization = verifyToken(req, res)
  const selected = req.query.selected || req.body?.selected

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    })
  } else {
    try {
      let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
              FROM cartItems LEFT JOIN books
              ON cartItems.book_id = books.id WHERE user_id = ?`
      let values = [authorization.id]

      if (selected) {
        sql += ' AND cartItems.id IN (?)'
        values.push(selected)
      }

      const [results] = await connection.query(sql, values)
      return res.status(StatusCodes.OK).json(results)
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }
  }
}

const removeCartItem = async (req, res) => {
  const connection = await getConnection()
  const authorization = verifyToken(req, res)

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    })
  } else {
    try {
      const cartItemId = req.params.id
      const [results] = await connection.query(
        'DELETE FROM cartItems WHERE id = ?',
        cartItemId
      )

      return res.status(StatusCodes.OK).json(results)
    } catch (error) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }
  }
}

module.exports = { addToCart, getCartItems, removeCartItem }
