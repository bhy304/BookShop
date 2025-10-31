const getConnection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')
const verifyToken = require('../utils/authorize')

// (카테고리별, 신간 여부) 전체 도서 목록 조회
const allBooks = async (req, res) => {
  const connection = await getConnection()
  const { category_id, news, limit, currentPage } = req.query

  try {
    let offset = limit * (currentPage - 1)
    let sql =
      'SELECT SQL_CALC_FOUND_ROWS *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books'
    let values = []
    if (category_id && news) {
      sql +=
        ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()'
      values.push(category_id)
    } else if (category_id) {
      sql += ' WHERE category_id = ?'
      values.push(category_id)
    } else if (news) {
      sql +=
        ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()'
    }
    sql += ' LIMIT ? OFFSET ?'
    values.push(parseInt(limit), offset)

    const [results] = await connection.query(sql, values)

    sql = 'SELECT FOUND_ROWS()'
    const [[rows]] = await connection.query(sql)

    return res.status(StatusCodes.OK).json({
      books: results,
      pagination: {
        currentPage: parseInt(currentPage),
        totalCount: rows['FOUND_ROWS()'],
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).end()
  }
}

// 개별 도서 조회
const bookDetail = async (req, res) => {
  const connection = await getConnection()
  const authorization = verifyToken(req, res)
  const liked_book_id = parseInt(req.params.id)

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    })
  } else if (authorization instanceof ReferenceError) {
    const sql = `SELECT *,
                (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes
                FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id = ?`

    const [[book]] = await connection.query(sql, [liked_book_id])

    if (book) {
      return res.status(StatusCodes.OK).json(book)
    } else {
      return res.status(StatusCodes.NOT_FOUND).end()
    }
  } else {
    const sql = `SELECT *,
                (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
                FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id = ?`

    const [[book]] = await connection.query(sql, [
      authorization.id,
      liked_book_id,
      liked_book_id,
    ])

    if (book) {
      return res.status(StatusCodes.OK).json(book)
    } else {
      return res.status(StatusCodes.NOT_FOUND).end()
    }
  }
}

module.exports = { allBooks, bookDetail }
