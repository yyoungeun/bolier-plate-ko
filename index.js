const express = require('express') //express module
const app = express() //새로운 express 앱 생성
const port = 5000 //상관없음
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false 
}).then(() => console.log('MongoDB Connected...')) //연결 성공
.catch(err => console.log(err)) //연결 실패


app.get('/', (req, res) => res.send('Hello World!~~안녕'))  //root directory에 오면 hello world 출력

app.post('/register', (req,res) => {
    //회원가입할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, user) =>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req,res) => {

    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
        user.comparePassword(req.body.password, (err, isMatch) => {

            if(!isMatch)
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            })

            //비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err); //400: 에러

                //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id })
            })
        })
    })
})

app.get('/api/users/auth', auth, (req,res) => {

    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 말.
    res.status(200).json({
        _id: req.user_id,
        //0: 일반 유저  0 이외: 관리자
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name:req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req,res) => {
    User.findOneAndUpdate({ _id: req.user._id}, //유저를 찾아서 update시켜라.
        {token: ""}
        , (err, user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        }) 
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))  //앱 실행