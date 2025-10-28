const getConnection = require('../mariadb')
const mariadb = require('mysql2/promise')
const { StatusCodes } = require('http-status-codes')

const order = async (req, res) => {
  const connection = await getConnection()

  try {
    const {
      items,
      delivery,
      totalQuantity,
      totalPrice,
      user_id,
      firstBookTitle,
    } = req.body
    const { address, receiver, contact } = delivery
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
      user_id,
      deliveryId,
    ])
    const orderId = orders.insertId

    // orderedBook 테이블 삽입
    const orderedBooksSql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`
    const values = []
    items.forEach((item) => values.push([orderId, item.book_id, item.quantity]))
    const [results] = await connection.query(orderedBooksSql, [values])

    return res.status(StatusCodes.OK).json(results)
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).end()
  } finally {
    await connection.end()
  }
}

const getOrders = (req, res) => {
  res.json('주문 목록 조회')
}

const getOrderDetails = (req, res) => {
  res.json('주문 상세 상품 조회')
}

module.exports = { order, getOrders, getOrderDetails }
