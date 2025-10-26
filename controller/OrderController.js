const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const order = (req, res) => {
  const {
    items,
    delivery,
    totalQuantity,
    totalPrice,
    user_id,
    firstBookTitle,
  } = req.body

  const sql =
    'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)'

  const { address, receiver, contact } = delivery

  const orderedBooksSql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`
  const deliveryId = 6
  const orderId = 2

  const values = []
  items.forEach((item) => values.push([orderId, item.book_id, item.quantity]))

  // connection.query(sql, [address, receiver, contact], (err, results) => {
  connection.query(orderedBooksSql, [values], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }
    return res.status(StatusCodes.OK).json(results)

    // const deliveryId = results.insertId
    // const orderId = results.insertId

    // const orderSql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`

    // connection.query(
    //   orderSql,
    //   [firstBookTitle, totalQuantity, totalPrice, user_id, deliveryId],
    //   (err, results) => {
    //     if (err) {
    //       console.log(err)
    //       return res.status(StatusCodes.BAD_REQUEST).end()
    //     }

    //     const orderId = results.insertId
    //     console.log(deliveryId, orderId)

    //     return res.status(StatusCodes.OK).json(results)
    //   }
    // )
  })
}

const getOrders = (req, res) => {
  res.json('주문 목록 조회')
}

const getOrderDetails = (req, res) => {
  res.json('주문 상세 상품 조회')
}

module.exports = { order, getOrders, getOrderDetails }
