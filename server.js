const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors());
const jwt = require('jsonwebtoken')
let url = require('./url')
const middleware = require('./middleware')

mongoose.connect(url,{dbName:'capstoneProject'})
    .then(()=>{
        console.log('connected to database')
    },
    (err)=>{
        console.log("Connection Failed",err)
    }
)

app.post("/login",async(req,res)=>{
    const {username,password,email,confirmpassword} = req.body;
    try{
        const IsUser = await mongoose.connection.db.collection("users").findOne({username,password,});
        if(!IsUser){
            res.json({resp:"Notfound"})
        }
        if(IsUser.password!==password){
            res.json({resp:"wrongpassword"})
        }
        else{
            let payload={
                user:{
                    _id:IsUser._id
                }
            }
            jwt.sign(payload,"capstone",{expiresIn:3400000},(err,token)=>{
                if(err){
                    res.json({resp:"errortoken"})
                }
                else{
                    res.json({resp:"success",token})
                }
            })
        }
    }
    catch(err){
        return console.log(err)
    }
})
app.get('/home',middleware, async(req,res)=>{
    try{
        let IsUser = await mongoose.connection.db.collection('users').findOne(req.user.id)
        if(!IsUser){
            res.json({resp:"Notfound"})
        }
        res.json({resp:"Found Rey"})
    }
    catch(err){
        return console.log(err)
    }
})
app.post('/signup',async(req,res)=>{
    const {username,password,email,confirmpassword} = req.body
    const IsUser = await mongoose.connection.db.collection("users").findOne({email})
    try{
        if(IsUser){
            return res.json({resp:"Exist"})
        }
        else{
            if(password!=confirmpassword){
                res.json({resp:"notmatched"})
            }
            else{
                let add = await mongoose.connection.db.collection("users").insertOne({username,password,email,confirmpassword})
                return res.json({res:"success"})
            }
        }
    }
    catch(err){
        console.log(err)
    }
})
app.get('/home',async(req,res)=>{
    const data = await mongoose.connection.db.collection('products').find().toArray()
    return res.json(data)
})
app.listen('1431',()=>{
    console.log("Listining")
})
app.post('/cart' , async(req,res)=>{
    const {products} = req.body
    try{
        let product = mongoose.connection.db.collection('cart').find({products}).toArray
        res.json(product)
    }
    catch(err){
        console.log(err)
    }
})