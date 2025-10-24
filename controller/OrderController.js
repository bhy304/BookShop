const connection = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const order = (req, res) => {
  res.json('결제(주문)')
}

const getOrders = (req, res) => {
  res.json('주문 목록 조회')
}

const getOrderDetails = (req, res) => {
  res.json('주문 상세 상품 조회')
}

module.exports = { order, getOrders, getOrderDetails }
