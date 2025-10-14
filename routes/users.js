const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const {
  join,
  login,
  passwordResetRequest,
  passwordReset,
} = require('../controller/UserController')

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
  login
)

router.post('/reset', [], passwordResetRequest) // 비밀번호 초기화 요청
router.put('/reset', [], passwordReset) // 비밀번호 초기화 (비밀번호 수정)

module.exports = router
