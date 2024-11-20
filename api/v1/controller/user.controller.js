const md5 = require("md5")
const User = require("../model/user.model");
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
            password: req.body.password
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
    
}