const jwt = require("jsonwebtoken")
const { response } = require("../helper/response")
const User = require('../models/userModel')
require('dotenv').config()

exports.checkLogin = async(req, res, next) => {
        try {
                const authorization = req.headers.authorization
                if(!authorization) return response(res,401,"false",{message:"Token is required"})
                const token = authorization.split(" ")[1]
                //var decoded = 
                jwt.verify(token, process.env.JWT_SECRET,async(err,decoded)=>{
                        if(err){
                                return response(res,401,"false",{message:err.message})
                        }else{
                        req.user = await User.findById(decoded.userId);
                        next()
                }
                    
                    });
               
        } catch (err) {
                console.log(err)
                return response(res,500,"false",{message:"Invalid JWT"})
        }
}
