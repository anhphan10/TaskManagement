const md5 = require("md5")
const User = require("../model/user.model");
const generate = require("../../../Helper/generate");
const sendMailHelper = require("../../../Helper/sendMail");
const ForgotPassword = require("../model/forgot-password.model")
//[POST]/api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existEmail) {
        res.json({
            code: 400,
            message: "Email Đã Tồn Tại"
        });
        return;
    }
    else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: generate.generateRandomString(30)
        })
        await user.save();
        const token = user.token;
        res.cookie("token" ,token);

        res.json({
            code: 200,
            message: "Thêm Thành Công",
            token:token
        })
    }
}
//[POST]/api/v1/users/login
module.exports.login = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        res.json({
            code:400,
            message:"Sai Email!!!"
        });
        return;
    }
    if(md5(password)!== user.password){
        res.json({
            code:400,
            message:"Sai Mật Khẩu!!!"
        });
        return;
    }
    const token = user.token;
    res.cookie("token" , token);
    res.json({
        code:200,
        message:"Đăng Nhập Thành Công",
        token: token
    })

} 
//[POST]/api/v1/users/password/forgot
module.exports.forgotPassword = async (req,res)=>{
    const email = req.body.email;
    const user = await User.findOne({
        email:email,
        deleted: false
    })
    if(!user){
        res.json({
            code:200,
            message: "Email Không Tồn Tại"
        })
        return;
    }
    //Lưu Vào Otp
    const otp = generate.getSecureRandomNumbers(8);
    const timeExpire = 5;
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire*60*1000
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    //Gửi otp qua emailUser
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>
    Vui lòng không chia sẻ cho bất kì ai
    `
    sendMailHelper.sendMail(email,subject,html);
    // Hết
    res.json({
        code:200,
        message:"Đã gửi mã OTP qua email"
    })
}
//[Post]/api/v1/users/password/otp
module.exports.otpPassword = async(req, res)=>{
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email:email,
        otp:otp
    })
    if(!result){
        res.json({
            code:400,
            message:"Mã OTP Không Hợp Lệ"
        })
        return;
    }
    const user = await User.findOne({
        email: email
    })
    const token = user.token;
    res.cookie("token",token);
    res.json({
        code:200,
        message:"Xác Thực Thành Công",
        token:token
    })
}
//[Post]/api/v1/users/password/reset
module.exports.resetPassword = async (req,res) =>{
    const user = await User.findOne({
        token: req.body.token,
        deleted : false
    });
    if(md5(req.body.password) == user.password){
        res.json({
            code:400,
            message:"Mật Khẩu Mới Phải Khác Mật Khẩu Cũ"
        });
        return;
    }
    await User.updateOne(
        {
            token: req.body.token,
        },
        {
            password: md5(req.body.password)
        }
    )
    res.json({
        code:200,
        message:"Đổi Mật Khẩu Thành Công"
    })
}
module.exports.detail = async (req,res) => {
    const token = req.cookies.token;
    try {
        const user = await User.findOne({
            token:token,
            deleted: false
        }).select("-password -token");
        res.json({
            code:200,
            user: user
        })
    } catch (error) {
        console.log(error)
    }
}