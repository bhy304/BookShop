const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

// 전체 도서 조회
const allBooks = (req, res) => {
  const sql = 'SELECT * FROM books'

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    return res.status(StatusCodes.OK).json(results)
  })
}

// 개별 도서 조회
const bookDetail = (req, res) => {
  const sql = ''

  connection.query(sql, (erro, results) => {
    res.json('개별 도서 조회')
  })
}

// 카테고리별 도서 목록 조회
const BooksByCategory = (req, res) => {
  const sql = ''

  connection.query(sql, (erro, results) => {
    res.json('카테고리별 도서 목록 조회')
  })
}

module.exports = { allBooks, bookDetail, BooksByCategory }
