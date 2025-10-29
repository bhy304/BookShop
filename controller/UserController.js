const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const crypto = require('crypto') // Node.js 내장 모듈: 암호화 관련 기능 제공

// 회원가입
const join = (req, res) => {
  const { email, password } = req.body
  const sql = `INSERT INTO users (email,  password, salt) VALUES (?, ?, ?)`

  // 회원가입시 비밀번호를 암호화해서 암호화된 비밀번호와 salt 값을 같이 DB에 저장
  const salt = crypto.randomBytes(10).toString('base64') // 복호화를 방해하기 위해 단방향 암호화시 소금(Salt)를 뿌려 해커가 복호화 하는 것을 방해하는 방법
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64') // 해싱

  connection.query(sql, [email, hashPassword, salt], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    res.status(StatusCodes.CREATED).json(results)
  })
}

// 로그인
const login = (req, res) => {
  const { email, password } = req.body
  const sql = `SELECT * FROM users WHERE email = ?`

  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    const [loginUser] = results

    // 로그인시, 이메일&원본비밀번호를 받아서 DB에 저장된 salt 값을 꺼내서 비밀번호 암호화
    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512')
      .toString('base64')

    // DB password와 일치하는지 비교
    if (loginUser && loginUser.password === hashPassword) {
      const token = jwt.sign(
        { id: loginUser.id, email: loginUser.email },
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

// 비밀번호 초기화 요청
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

// 비밀번호 초기화 (비밀번호 수정)
const passwordReset = (req, res) => {
  const { email, password } = req.body
  const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`

  const salt = crypto.randomBytes(10).toString('base64')
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64')

  connection.query(sql, [hashPassword, salt, email], (err, results) => {
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
