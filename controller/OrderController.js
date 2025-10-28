const getConnection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const order = async (req, res) => {
  const connection = await getConnection()

  const {
    items,
    delivery,
    totalQuantity,
    totalPrice,
    user_id,
    firstBookTitle,
  } = req.body
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
      user_id,
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

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).end()
  } finally {
    await connection.end()
  }
}

const deleteCartItems = async (connection, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`

  let result = await connection.query(sql, [items])
  return result
}

const getOrders = async (req, res) => {
  const connection = await getConnection()

  const sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
                FROM orders
                LEFT JOIN delivery
                ON orders.delivery_id = delivery.id`

  const [rows, fields] = await connection.query(sql)

  return res.status(StatusCodes.OK).json(rows)
}

const getOrderDetails = (req, res) => {
  res.json('주문 상세 상품 조회')
}

module.exports = { order, getOrders, getOrderDetails }
