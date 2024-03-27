const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const requireSignIn = async (req,res,next) => {
    try{
        const decode = await jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        req.user = decode
        next()
    }
    catch(error){
        console.log(error)
    }
}

const isAdmin = async (req,res,next) => {
    try{
        const user = await userModel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(401).send({
                success: false,
                message: 'Unauthorized Access'
            })
        }
        else{
            next()
        }
    }
    catch(error){
        console.log(error)
        res.status(404).send({
            success: false,
            error
        })
    }
}

module.exports={requireSignIn, isAdmin}