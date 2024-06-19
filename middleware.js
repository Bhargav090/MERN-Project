const jwt = require('jsonwebtoken')
module.exports = function(req,res,next){
    try{
        let token = req.header('Bhargav')
        if(!token){
            res.json({resp:"Token not found"})
        }
        let decode = jwt.verify(token,"capstone")
        req.user = decode.user
        next()
    }
    catch(err){
        res.json({resp:"Invalid token"})
    }
}