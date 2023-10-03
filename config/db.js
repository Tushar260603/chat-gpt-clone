const mongoose=require('mongoose')
const colors=require('colors')

const connectDB=async ()=>{
try {
   await mongoose.connect('mongodb://0.0.0.0:27017/chatgpt')
   console.log("connected to mongodb "+mongoose.connection.host) 
} catch (error) {
    console.log(error)
}
}
module.exports=connectDB




