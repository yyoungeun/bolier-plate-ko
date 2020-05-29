import React, { useState } from 'react'
//import Axios from 'axios'  //redux를 이용해 request보내므로 필요 없다 (props)
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function RegisterPage(props){
        const dispatch = useDispatch();
    
        const[Email, setEmail] = useState("")
        const[Name, setName] = useState("")
        const[Password, setPassword] = useState("")
        const[ConfirmPassword, setConfirmPassword] = useState("")
    
        const onEmailHandler = (event) => {
            setEmail(event.currentTarget.value)
        }

        const onNameHandler = (event) => {
            setName(event.currentTarget.value)
        }
    
        const onPasswordHandler = (event) => {
            setPassword(event.currentTarget.value)
        }

        const onConfirmPasswordHandler = (event) => {
            setConfirmPassword(event.currentTarget.value)
        }
    
        const onSubmitHandler = (event) => {
            event.preventDefault();
    
            //console.log('Email', Email)
            //console.log('Password', Password)

            if(Password !== ConfirmPassword){
                return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
            } //같지 않으면 아래로 못간다.(유효성 검사)
    
            let body = {
                email: Email,
                name: Name,
                password: Password
            }
    
            dispatch(registerUser(body))  //action 날리기~
            .then(response => {   //page이동
                if(response.payload.success){
                    props.history.push("/login")  //loginpage
                }else{
                    alert("Faild to sign up") //실패 메세지
                }
            })
        }

    return(

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height:'100vh'}}>

        <form style={{display: 'flex', flexDirection:'column'}}
            onSubmit={onSubmitHandler}>
            <label>Email</label>
            <input type="email" value={Email} onChange={onEmailHandler} />  {/* value에 state(변화)넣어줘야 한다. */}

            <label>Name</label>
            <input type="text" value={Name} onChange={onNameHandler} />

            <label>Password</label>
            <input type="password" value={Password} onChange={onPasswordHandler} />

            <label>Confirm Password</label>
            <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

            <br/>
            <button type="submit">
                회원가입
            </button>
        </form>
    </div>
    )
}

export default withRouter(RegisterPage)