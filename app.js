const express = require('express')
const cors = require('cors')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

app.listen(process.env.PORT)

const bookRouter = require('./routes/books')
const categoryRouter = require('./routes/category')
const cartRouter = require('./routes/carts')
const likeRouter = require('./routes/likes')
const orderRouter = require('./routes/orders')
const userRouter = require('./routes/users')

app.use('/books', bookRouter)
app.use('/category', categoryRouter)
app.use('/carts', cartRouter)
app.use('/likes', likeRouter)
app.use('/orders', orderRouter)
app.use('/users', userRouter)
