const categoryModel = require('../models/categoryModel')
const slugify = require('slugify')
const createCategoryController = async (req,res) => {
    try{
        const {name} = req.body
        if(!name){
            return res.status(404).send({message: 'Name is required'})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(404).send({success:false, message: 'Category already exists'})
        }
        const category = await new categoryModel({name, slug: slugify(name)}).save()
        return res.status(201).send({success:true, message: 'Category created', category})
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}

const updateCategoryController = async(req,res) => {
    try{
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name, slug: slugify(name)}, {new:true})
        await category.save()
        res.status(200).send({
            success:true,
            message: 'Category updated successfully', 
            category
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while updating Category'
        })
    }
}
const getCategoryController = async(req,res) => {
    try{
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message: 'Category list', 
            category
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting Category'
        })
    }
}
const singleCategoryController = async(req,res) => {
    try{
        const category = await categoryModel.findOne({slug: req.params.slug})
        res.status(200).send({
            success:true,
            message: 'get Category', 
            category
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting Category'
        })
    }
}
const deleteCategoryController = async(req,res) => {
    try{
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message: 'Category deleted successfully',
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting Category'
        })
    }
}

module.exports = {createCategoryController, updateCategoryController, getCategoryController, singleCategoryController, deleteCategoryController}