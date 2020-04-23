const mongoose = require('mongoose'); //mongoose module
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){ //user정보를 저장하기 전
    var user = this;

    if(user.isModified('password')){  //비밀번호가 수정되었을 때
    //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds,function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567  암호화된 비밀번호 $2b$10$N6GTUX0dQYk0ciypcL0vEOElWbdIo0smbzdv7OXymuBV0Xuexugd2
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch) //에러 없고, 비밀번호 같다.
    })
}

userSchema.methods.generateToken = function(cb){ //콜백
    var user = this;
    //jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // 해석-> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user) //user정보 전달
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //user._id + '' =token
    //토큰을 decode한다.(복호화)
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema) 

module.exports = {User}