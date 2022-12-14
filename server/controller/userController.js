const User = require('../model/user')
const { asyncCatch } = require('../utils/asyncCatch')
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const sendMail=require('../utils/email');
const crypto=require("crypto");

const signJwt = id => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    return token;
}

exports.changePassword=asyncCatch(async(req,res,next)=>{
    const user=await User.findById(req.user.id);

    const isOkay=await user.checkPasswords(req.body.currentPassword);


    if(!isOkay) return next(new GlobalError("Incorrect password",400));

    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    await user.save();

    const token=signJwt(user._id);

    res.json({
        success:true,
        token,
    });
})
exports.changeUserData=asyncCatch(async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.user.id,{name:req.body.name,email:req.body.email},{new:true});
    user.name=req.body.name;
    user.email=req.body.email;
    // user.phone=req.body.phone;


    res.json({
        success:true,
        user,
    });
})