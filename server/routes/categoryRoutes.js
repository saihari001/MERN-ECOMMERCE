const express = require('express')
const router = express.Router()
const {requireSignIn, isAdmin} = require('../middlewares/authMiddleware')
const {createCategoryController, updateCategoryController, getCategoryController, singleCategoryController, deleteCategoryController} = require('../controllers/categoryController')

router.post('/create-category', requireSignIn, isAdmin, createCategoryController)
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)
router.get('/get-category', getCategoryController)
router.get('/single-category:slug', singleCategoryController)
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)


module.exports = router