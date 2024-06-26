const express = require('express')
const {registerController, loginController, testController, forgotPasswordController, updateController} = require('../controllers/authController')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware')
//router object
const router = express.Router()
const cors = require('cors')

router.use(
    cors({
        credentials: true,
        origin: ['http://localhost:5173', 'https://mern-ecommerce-bab0.onrender.com'],
    })
)

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/forgot-password', forgotPasswordController)
router.get('/test', requireSignIn, isAdmin, testController)
router.put('/profile-update', requireSignIn, updateController)

router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ok: true});
});

router.get('/admin-auth', requireSignIn, isAdmin, (req,res) => {
    res.status(200).send({ok: true});
});



module.exports = router