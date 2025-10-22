const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

// (카테고리별, 신간 여부) 전체 도서 목록 조회
const allBooks = (req, res) => {
  const { category_id, news, limit, currentPage } = req.query

  let offset = limit * (currentPage - 1)
  let sql =
    'SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books'
  let values = []
  if (category_id && news) {
    sql +=
      ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()'
    values.push(category_id)
  } else if (category_id) {
    sql += ' WHERE category_id = ?'
    values.push(category_id)
  } else if (news) {
    sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()'
  }
  sql += ' LIMIT ? OFFSET ?'
  values.push(parseInt(limit), offset)

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    if (results.length) {
      return res.status(StatusCodes.OK).json(results)
    } else {
      return res.status(StatusCodes.NOT_FOUND).end()
    }
  })
}

// 개별 도서 조회
const bookDetail = (req, res) => {
  const { user_id } = req.body
  const book_id = parseInt(req.params.id)
  const sql = `SELECT *,
              (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes,
              (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
              FROM books
              LEFT JOIN category
              ON books.category_id = category.category_id
              WHERE books.id = ?`

  connection.query(sql, [user_id, book_id, book_id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    const [book] = results
    if (book) {
      return res.status(StatusCodes.OK).json(book)
    } else {
      return res.status(StatusCodes.NOT_FOUND).end()
    }
  })
}

module.exports = { allBooks, bookDetail }
