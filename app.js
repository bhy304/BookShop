const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

app.listen(process.env.PORT)

const bookRouter = require('./routes/books')
const cartRouter = require('./routes/carts')
const likeRouter = require('./routes/likes')
const orderRouter = require('./routes/orders')
const userRouter = require('./routes/users')

app.use('/books', bookRouter)
app.use('/carts', cartRouter)
app.use('/likes', likeRouter)
app.use('/orders', orderRouter)
app.use('/users', userRouter)
