const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const addToCart = (req, res) => {
  const { book_id, quantity, user_id } = req.body

  const sql =
    'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);'

  connection.query(sql, [book_id, quantity, user_id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}
// 장바구니 아이템 목록 조회
const getCartItems = (req, res) => {
  const { user_id } = req.body

  const sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
              FROM cartItems LEFT JOIN books
              ON cartItems.book_id = books.id WHERE user_id = ?`

  connection.query(sql, user_id, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

const removeCartItem = (req, res) => {
  const { id } = req.params // cartItemId

  const sql = 'DELETE FROM cartItems WHERE id = 1'

  connection.query(sql, id, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

// (장바구니에서 선택한) 주문 “예상” 상품 목록 조회

module.exports = { addToCart, getCartItems, removeCartItem }
