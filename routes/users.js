const express = require('express')
const router = express.Router()
const connection = require('../mariadb')
const { body, validationResult } = require('express-validator')
const join = require('../controller/UserController')

router.use(express.json())

// 회원가입
router.post(
  '/join',
  [
    body('email')
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage('이메일 확인 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
  ],
  join
)


// 로그인
router.post(
  '/login',
  [
    body('email')
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage('이메일 확인 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
    validate,
  ],
  (req, res) => {
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
)

// 로그인
router.post('/login', (req, res) => {
  res.json('로그인')
})

// 비밀번호 초기화 요청
router.post('/reset', (req, res) => {
  res.json('비밀번호 초기화 요청')
})

// 비밀번호 초기화 (비밀번호 수정)
router.put('/reset', (req, res) => {
  res.json('비밀번호 초기화')
})

module.exports = router
