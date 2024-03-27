const express = require('express')
const cors = require('cors')
const mongodb = require('mongoose')
const morgan = require('morgan')
const routes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
require('dotenv').config()

//reset object
const app = express()

//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

//database
mongodb.connect(process.env.MONGODB)
.then(console.log('Database connected'))
.catch((err) => {console.log(err)})

// routes
app.use('/', routes)
app.use('/category', categoryRoutes)
app.use('/product', productRoutes)

// api
app.get('/', (req,res) => {
    res.send({
        message: 'welcome to ecommerce app'
    })
})

// port
app.listen(process.env.PORT, () => {console.log(`Server running on port ${process.env.PORT}`)})