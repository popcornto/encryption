//jshint esversion:6
require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()
const Port = process.env.Port | 3000

const db = "mongodb://127.0.0.1:27017/userDB"

async function run(){
    await mongoose.connect(db).then(()=>console.log("connected")).catch(e=>console.log(e));
  } 

  run()

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  }
)



userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"]})

const User = new mongoose.model("User", userSchema)

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))


app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/register", (req,res)=>{
    
    res.render("register")
})

app.post("/register", async (req,res)=>{
    await run()
    const userName = req.body.username
    const password = req.body.password
    const newUser = new User({
        email: userName,
        password: password
    })
    await User.create(newUser)
    res.render("secrets")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async (req,res)=>{
    const userName = req.body.username
    const password = req.body.password
    const exists = await User.exists({email: userName})
    
    
        if(exists){
           const pass = await User.find({email: userName})
           console.log(pass[0].password);
           if(pass[0].password === password){
            res.render("secrets")
           }else{
            res.send("your password is wrong")
           }
        }
    
})

app.listen(Port, ()=>{
    console.log("listning to port:" + Port);
})