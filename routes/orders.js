const express = require('express')
const router = express.Router()

router.use(express.json())

// 결제(주문)
router.post('/', (req, res) => {
  res.json('결제(주문)')
})

// 주문 목록 조회
router.get('/', (req, res) => {
  res.json('주문 목록 조회')
})

// 주문 상세 상품 조회
router.delete('/:id', (req, res) => {
  res.json('주문 상세 상품 조회')
})

module.exports = router
