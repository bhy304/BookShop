const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')
const verifyToken = require('../utils/authorize')

const addToCart = (req, res) => {
  const authorization = verifyToken(req, res)
  const { book_id, quantity } = req.body

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    })
  }

  const sql =
    'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);'

  connection.query(
    sql,
    [book_id, quantity, authorization.id],
    (err, results) => {
      if (err) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).end()
      }

      return res.status(StatusCodes.OK).json(results)
    }
  )
}

// 장바구니 아이템 목록 조회
// (장바구니에서 선택한) 주문 “예상” 상품 목록 조회
const getCartItems = (req, res) => {
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
  }

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
              FROM cartItems LEFT JOIN books
              ON cartItems.book_id = books.id WHERE user_id = ?`
  let values = [authorization.id]

  if (selected) {
    sql += ' AND cartItems.id IN (?)'
    values.push(selected)
  }

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

const removeCartItem = (req, res) => {
  const cartItemId = req.params.id

  const sql = 'DELETE FROM cartItems WHERE id = ?'

  connection.query(sql, cartItemId, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

module.exports = { addToCart, getCartItems, removeCartItem }
