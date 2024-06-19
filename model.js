const mongoose = require('mongoose')
let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    confirmpassword: String
})
module.exports =mongoose.model("UserSchema", UserSchema)