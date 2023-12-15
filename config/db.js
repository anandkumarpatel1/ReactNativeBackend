const mogoose = require('mongoose')

const connectDB = async () =>{
    try {
        await mogoose.connect(process.env.MONGO_URI)
        console.log(`Connected to DataBase ${mogoose.connection.host}`)
    } catch (error) {
        console.log(`Error in connection DB ${error}`)
    }
}

module.exports = connectDB