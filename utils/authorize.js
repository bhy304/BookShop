const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const verifyToken = (req, res) => {
  try {
    const token = req.headers['authorization']
    if (!token) {
      throw new ReferenceError('JWT must be provided')
    }

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
    return decoded
  } catch (error) {
    console.log(error.name)
    console.log(error.message)

    // if (error.name === 'TokenExpiredError') {
    //   return res.status(StatusCodes.UNAUTHORIZED).json({
    //     message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    //   })
    // }

    // if (error.name === 'JsonWebTokenError') {
    //   return res.status(StatusCodes.UNAUTHORIZED).json({
    //     message: '유효하지 않은 토큰입니다. 다시 로그인 하세요.',
    //   })
    // }

    return error
  }
}

module.exports = verifyToken
