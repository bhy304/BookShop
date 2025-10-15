const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const join = (req, res) => {
  const { email, password } = req.body
  const sql = `INSERT INTO users (email,  password) VALUES (?, ?)`

  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    res.status(StatusCodes.CREATED).json(results)
  })
}

const login = (req, res) => {
  const { email, password } = req.body
  const sql = `SELECT * FROM users WHERE email = ?`

  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    const [loginUser] = results

    if (loginUser && loginUser.password === password) {
      const token = jwt.sign(
        { email: loginUser.email },
        process.env.PRIVATE_KEY,
        { expiresIn: '5m', issuer: 'hayeon' }
      )

      res.cookie('token', token, { httpOnly: true })

      console.log(token) // 발급된 토큰 확인용

      res.status(StatusCodes.OK).json({
        message: `로그인되었습니다.`,
      })
    } else {
      // 403 Forbidden (접근 권리 없음), 401 Unauthorized (인증 실패)
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: '이메일 또는 비밀번호가 틀렸습니다.',
      })
    }
  })
}

const passwordResetRequest = (req, res) => {
  const { email } = req.body
  const sql = `SELECT * FROM users WHERE email = ?`

  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    const [user] = results

    if (user) {
      return res.status(StatusCodes.OK).json({ email })
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end()
    }
  })
}

const passwordReset = (req, res) => {
  const { email, password } = req.body
  const sql = `UPDATE users SET password = ? WHERE email = ?`

  connection.query(sql, [password, email], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    if (results.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).end()
    } else {
      res.status(StatusCodes.OK).end()
    }
  })
}

module.exports = { join, login, passwordResetRequest, passwordReset }
