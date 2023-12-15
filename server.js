const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const morgon = require('morgan')
const  connectDB  = require('./config/db')

//dot env
dotenv.config()

//mongo connection
connectDB()


//middlewares
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgon('dev'))

//routes
app.use('/api/v1/auth', require('./routes/userRoute'))

//listing port
app.listen(process.env.PORT, () =>{
    console.log(`Server is starting on ${process.env.PORT}`)
})
