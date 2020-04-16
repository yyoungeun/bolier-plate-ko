const express = require('express') //express module
const app = express() //새로운 express 앱 생성
const port = 5000 //상관없음

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:admin@cluster0-idmu1.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false 
}).then(() => console.log('MongoDB Connected...')) //연결 성공
.catch(err => console.log(err)) //연결 실패


app.get('/', (req, res) => res.send('Hello World!~~안녕'))  //root directory에 오면 hello world 출력

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))  //앱 실행