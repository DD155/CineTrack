import './Login.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const path = "http://localhost:3001/" // url for server

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let navigate = useNavigate()

    const handleLogin = () => {
        let req = path + "login"
        axios.post(req, {
            email: email,
            password: password
        }).then((res) => {
            if (res.data.message) alert(res.data.message)
            else navigate('/')
        })
    }

    return (
        <div className="App">
            <div>
                <h1> Login </h1>
                <label> Email </label>
                <input type='text' onChange= {(e) => setEmail(e.target.value)} /> <br/>
                <label> Password </label> 
                <input type='password' onChange= {(e) => setPassword(e.target.value)} /> <br/>
                <button onClick = {handleLogin}> Login </button>
                
            </div>
        </div>
    );
}

export default Login;
