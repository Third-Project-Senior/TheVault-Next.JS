const express = require('express')
const router = express.Router()

const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const cartRouter = require('./cartRouter')
const payementRouter = require ('./paymentRouter')

router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/cart', cartRouter)
router.use('/payment', payementRouter)





module.exports = router