const express = require('express')
const router = express.Router()
const {
  order,
  getOrders,
  getOrderDetails,
} = require('../controller/OrderController')

router.use(express.json())

router.post('/', order)
router.get('/', getOrders)
router.get('/:id', getOrderDetails)

module.exports = router
