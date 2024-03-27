const { default: slugify } = require('slugify')
const productModel = require('../models/productModel')
const fs = require('fs')
const path = require('path')
const braintree=require('braintree')
require('dotenv').config()

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  });

const addProductController = async(req,res) => {
    try{
        const {name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files
        
        switch(true){
            case !name:
                return res.status(500).send({error: 'Name is required'})
            case !description:
                return res.status(500).send({error: 'description is required'})
            case !price:
                return res.status(500).send({error: 'price is required'})
            case !category:
                return res.status(500).send({error: 'category is required'})
            case !quantity:
                return res.status(500).send({error: 'quantity is required'})
            case !photo && photo.size > 1000000:
                return res.status(500).send({error: 'photo is required and should be less than 1mb'})
        }
        const products = new productModel({...req.fields, slug: slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message: 'Product created successfully', 
            products
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in adding Product'
        })
    }
}

const getProductController = async (req,res) => {
    try{
        const product = await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt: -1})
        res.status(200).send({
            success: true,
            countTotal: product.length,
            message: 'All Prodcuts fetched',
            product,
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in adding Product',
            error
        })
    }
}

const getSingleProductController = async (req,res) => {
    try{
        const product = await productModel.findOne({slug: req.params.slug}).populate("category").select("-photo")
        res.status(200).send({
            product,
            success:true,
            message: 'Single product fetched',
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting Category',
            error
        })
    }
}

const getProductPhotoController = async (req, res) => {
    try{
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting Photos',
            error
        })
    }
}

const deleteProductController = async(req,res) => {
    try{
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message: 'Product deleted successfully',
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while deleting product',
            error,
        })
    }
}

const updateProductController = async(req,res) => {
    try{
        const {name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files

        switch(true){
            case !name:
                return res.status(500).send({error: 'Name is required'})
            case !description:
                return res.status(500).send({error: 'description is required'})
            case !price:
                return res.status(500).send({error: 'price is required'})
            case !category:
                return res.status(500).send({error: 'category is required'})
            case !quantity:
                return res.status(500).send({error: 'quantity is required'})
            case !photo && photo.size > 1000000:
                return res.status(500).send({error: 'photo is required and should be less than 1mb'})
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields, slug: slugify(name)}, {new:true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(200).send({
            success:true,
            message: 'Product updated successfully', 
            products
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while updating Product'
        })
    }
}

const productFilterController = async(req,res) => {
    try{
        const {checked, radio} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]}
        const product = await productModel.find(args)
        res.status(200).send({
            success: true,
            product
        });
    }
    catch(error){
        console.log(error)
        res.status(400).send({message: "error while filtering", success: false, error})
    }
}

const searchProductController = async(req,res) => {
    try{
        const {keyword} = req.params
        const result = await productModel.find({
            $or: [
                {name: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}},
            ],
        })
        .select("-photo");
        res.json(result);
    }
    catch(error){
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Error in Search Product",
            error
        })
    }
}

//payment gate

const braintreeTokenController = async (req,res) => {
    try{
        const clientToken = gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err)
            }
            else{
                res.send(response)
            }
        })
        console.log(clientToken)
    }
    catch(error){
        console.log(error)
    }
}

const braintreePaymentController = async(req,res) => {
    try{
        const {cart, nonce} = req.body
        let total = 0
        cart.map((i) => {total += i.price})
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            }
        }, function(error, result){
            if(result){
                const order = new orderModel({
                    products: cart,
                    payment: result, 
                    buyer: req.user._id
                }).save()
                res.json({ok: true})
            }
            else{
                res.status(500).send(error)
            }
        })
    }
    catch(error){
        console.log(error)
    }
}



module.exports = {addProductController, getProductController, getSingleProductController, getProductPhotoController, deleteProductController, updateProductController, productFilterController, searchProductController, braintreeTokenController, braintreePaymentController}