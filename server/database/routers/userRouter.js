const express = require('express')
const router = express.Router()

const {Sign_up,authenticate,deleteUser,getAllUsers,getUserById,isAdmin,login,updateUser} = require('../controllers/userController')

router.post('/signup', Sign_up)
router.post('/login', login)

router.get('/',authenticate,isAdmin, getAllUsers)
router.get('/user/:id', authenticate, getUserById)

router.put('/:id', updateUser)
router.delete('/:id', authenticate, isAdmin, deleteUser)

module.exports = router