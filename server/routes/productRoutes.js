const express = require('express')
const router = express.Router()
const {requireSignIn, isAdmin} = require('../middlewares/authMiddleware')
const formidable = require('express-formidable')
const { addProductController, getProductController, getSingleProductController, getProductPhotoController, deleteProductController, updateProductController, productFilterController, searchProductController, braintreeTokenController, braintreePaymentController } = require('../controllers/productController')


router.post('/add-product', requireSignIn, formidable(), isAdmin, addProductController)
router.put('/update-product/:pid', requireSignIn, formidable(), isAdmin, updateProductController)
router.get('/get-product', getProductController)
router.get('/get-product/:slug', getSingleProductController)
router.get('/get-product/photo/:pid', getProductPhotoController)
router.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController)

//filter product routes
router.post('/product-filters', productFilterController)

//search product
router.get('/search/:keyword', searchProductController)

//payment routes
//token
router.get('/braintree/token', braintreeTokenController)

//payment
router.post('/braintree/payment',requireSignIn, braintreePaymentController)

module.exports = router