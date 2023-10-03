const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
const bodyParser=require('body-parser')
const colors=require('colors')
const dotenv=require('dotenv')
const connectDB = require('./config/db')
const path=require('path')
dotenv.config();

connectDB();

const authRoutes=require('./routes/authroute')
const errorHandler = require('./middlewares/errorMiddleware')


const app=express();

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"],
}))

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('dev'))
app.use(errorHandler)
const PORT=process.env.PORT || 8080

//api routes

app.use('/api/v1/auth',authRoutes)

app.use('/api/v1/openai',require('./routes/openAiRoutes'))


//static file

app.use(express.static(path.join(__dirname,"./client/build")))


app.get('*',function(req,res){
res.sendFile(path.join(__dirname,'./client/build/index.html'))
})





app.listen(PORT,()=>{
    console.log("Server running on "+PORT+" port")
})








