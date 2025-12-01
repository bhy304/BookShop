const pool = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')
const verifyToken = require('../utils/authorize')

const order = async (req, res) => {
  const connection = await pool.getConnection()
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
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
      req.body
    const { address, receiver, contact } = delivery

    try {
      // delivery 테이블 삽입
      const sql =
        'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)'
      let [deliveries] = await connection.execute(sql, [
        address,
        receiver,
        contact,
      ])
      const deliveryId = deliveries.insertId

      // orders 테이블 삽입
      const orderSql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`
      let [orders] = await connection.execute(orderSql, [
        firstBookTitle,
        totalQuantity,
        totalPrice,
        authorization.id,
        deliveryId,
      ])
      const orderId = orders.insertId

      // items를 가지고 장바구니에서 book_id, quantity 조회
      const cartItemsSql =
        'SELECT book_id, quantity FROM cartItems WHERE id IN (?)'
      let [orderedItems, fields] = await connection.query(cartItemsSql, [items])

      // orderedBook 테이블 삽입
      const orderedBooksSql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`
      const values = []
      orderedItems.forEach((item) =>
        values.push([orderId, item.book_id, item.quantity])
      )
      const [results] = await connection.query(orderedBooksSql, [values])

      // 장바구니 삭제
      let result = await deleteCartItems(connection, items)

      connection.release()
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      console.log(error)
      connection.release()
      return res.status(StatusCodes.BAD_REQUEST).end()
    }
  }
}

const deleteCartItems = async (connection, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`

  let result = await connection.query(sql, [items])
  return result
}

// 회원 id 별로 조회 필요
const getOrders = async (req, res) => {
  const connection = await pool.getConnection()
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
    const sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
                FROM orders
                LEFT JOIN delivery
                ON orders.delivery_id = delivery.id`

    const [rows, fields] = await connection.query(sql)
    connection.release()

    return res.status(StatusCodes.OK).json(rows)
  }
}

const getOrderDetail = async (req, res) => {
  const connection = await pool.getConnection()
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
    const orderId = req.params.id

    const sql = `SELECT book_id, title, author, price, quantity
                  FROM orderedBook
                  LEFT JOIN books
                  ON orderedBook.book_id = books.id
                  WHERE order_id = ?`

    const [rows, fields] = await connection.query(sql, [orderId])
    connection.release()

    return res.status(StatusCodes.OK).json(rows)
  }
}

module.exports = { order, getOrders, getOrderDetail }
