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
router.post(
  '/login',
  [
    body('email')
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage('이메일 확인 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
  ],
  login
)
router.post('/reset', [], passwordResetRequest)
router.put('/reset', [], passwordReset)

module.exports = router
