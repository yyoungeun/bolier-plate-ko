import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';

export function loginUser(dataToSubmit){ //body(parameter를 통해 받는다.)
    
    
    const request = axios.post('/api/users/login', dataToSubmit) //body 넘겨준다.(index.js)
    .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit){ //body(parameter를 통해 받는다.)
    
    
    const request = axios.post('/api/users/register', dataToSubmit) //body 넘겨준다.(index.js)
    .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function auth(){   //body(parameter를 통해 받는다.)


    const request = axios.get('/api/users/auth')  //get method : body부분 필요없다.
    .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}