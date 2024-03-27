const userModel = require('../models/userModel.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const registerController = async(req,res) => {
    try{
        const {name, email, password, phone, address, answer} = req.body
        //validation
        if(!name){
            return res.send({message: 'Name is Required'})
        }
        if(!email){
            return res.send({message: 'Email is Required'})
        }
        if(!password){
            return res.send({message: 'Password is Required'})
        }
        if(!phone){
            return res.send({message: 'Phone is Required'})
        }
        if(!address){
            return res.send({message: 'Address is Required'})
        }
        if(!answer){
            return res.send({message: 'Answer is Required'})
        }
        //check user
        const exisitingUser = await userModel.findOne({email: email})
        //existing user
        if(exisitingUser){
            return res.status(200).send({
                success: false,
                message: 'Already registered pls login',
            })
        }
        //register user
        const hashedPassword = await bcrypt.hash(password, 10)
        //save
        const user = new userModel({name: name, email: email, phone: phone, address: address, answer: answer, password: hashedPassword})
        user.save()
        res.status(200).send({
            success: true,
            message: 'User registered successfull',
            user
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in registration',
            error
        })
    }
}

const loginController = async (req,res) => {
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'email not registered'
            })
        }
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.status(201).send({
                success: false,
                message: 'invalid password',
            })
        }
        const token = await jwt.sign({_id:user._id}, process.env.JWT_KEY, {expiresIn: '7d'});
        res.status(200).send({
            success: true,
            message: 'Login successfull',
            user: {
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        })
    }
}

const testController = (req,res) => {
    try{
        res.send('test protected')
    }
    catch(error){
        console.log(error)
        res.send({error})
    }
}

const forgotPasswordController = async (req,res) => {
    try{
        const {email, answer, password} = req.body
        if(!email){
            if(!email){
                return res.send({message: 'Email is Required'})
            }
            if(!password){
                return res.send({message: 'Password is Required'})
            }
            if(!answer){
                return res.send({message: 'Answer is Required'})
            }
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'email not registered'
            })
        }
        if(answer !== user.answer){
            return res.status(404).send({
                success: false,
                message: 'invalid answer'
            })
        }
        const hashpassword = await bcrypt.hash(password,10)
        await userModel.findByIdAndUpdate(user._id, {password: hashpassword})
        res.status(200).send({
            success: true,
            message: 'Password reset successfull',
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

const updateController = async (req,res) => {
    try{
        const {name, email, password, phone, address} = req.body
        const user = await userModel.findById(req.user._id);
        if(password && password.length < 6){
            return res.json({error: "Password is required & should be 6 characters"})
        }
        const hashedPassword = password ? await bcrypt.hash(password,10) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, 
            {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
            }, 
            {new: true}
        )
        res.status(200).send({
            success: true,
            message: 'Profile Updated successfully',
            updatedUser
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

module.exports = {registerController, loginController, testController, forgotPasswordController, updateController}