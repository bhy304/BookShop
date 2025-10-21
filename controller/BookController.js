const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

// 전체 도서 조회
const allBooks = (req, res) => {
  const { category_id } = req.query

  if (category_id) {
    const sql = 'SELECT * FROM books WHERE category_id = ?'

    connection.query(sql, category_id, (err, results) => {
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
  } else {
    const sql = 'SELECT * FROM books'

    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).end()
      }

      return res.status(StatusCodes.OK).json(results)
    })
  }
}

// 개별 도서 조회
const bookDetail = (req, res) => {
  const id = parseInt(req.params.id)
  const sql = 'SELECT * FROM books WHERE id = ?'

  connection.query(sql, id, (err, results) => {
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
