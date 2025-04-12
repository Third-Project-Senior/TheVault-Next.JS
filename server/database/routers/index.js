const express = require('express')
const router = express.Router()

const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const cartRouter = require('./cartRouter')
const payementRouter = require ('./paymentRouter')
const CategRouter = require('./categorie.routes')

router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/cart', cartRouter)
router.use('/payment', payementRouter)
router.use('/category', CategRouter)





module.exports = router