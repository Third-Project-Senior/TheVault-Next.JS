const express = require('express')
const router = express.Router()

const {Sign_up,authenticate,deleteUser,getAllUsers,getUserById,isAdmin,login,updateUser,resetpass,findmail} = require('../controllers/userController')

router.post('/signup', Sign_up)
router.post('/Login', login)

router.get('/',authenticate,isAdmin, getAllUsers)
router.get('/user/:id', authenticate, getUserById)

router.put('/:id', updateUser)
router.put('/reset/:email', resetpass)
router.delete('/:id', authenticate, isAdmin, deleteUser)

module.exports = router