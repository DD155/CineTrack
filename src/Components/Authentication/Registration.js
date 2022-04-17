import './Registration.css';
import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'

const path = "http://localhost:3001/" // url for server

const Registration = () => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    let navigate = useNavigate()

    const handleSubmit = () => {
        if (!checkValidCredentials()) return

        let req = path + "register"
        axios.post(req, {
            email: email,
            first_name: firstName, 
            last_name: lastName,
            password: password
        }).then((res) => {
            console.log(res)
            if (res.data.message.length > 0) alert(res.data.message)
            else navigate("/")
        })
    }

    const checkValidCredentials = () => {
        return (password === confirmPassword) && (firstName.length < 15) && (lastName.length < 15)
        && (email.indexOf('@') !== -1) && (email.indexOf('.') !== -1)
    }

return (
    <div className="App">
        <div>
            <h1> Registration </h1>

            <label> Email </label>
            <input type='text' onChange={(e) => setEmail(e.target.value)} /> <br/>

            <label> First Name </label>
            <input type='text' onChange= {(e) => setFirstName(e.target.value)}/> <br/>

            <label> Last Name </label>
            <input type='text' onChange={(e) => setLastName(e.target.value)}/> <br/>

            <label> Password </label> 
            <input type='password' onChange={(e) => setPassword(e.target.value)}/> <br/>
            
            <label> Confirm Password </label>
            <input type='password' onChange={(e) => setConfirmPassword(e.target.value)}/> <br/>
            
            <button onClick = {handleSubmit}> Register </button> 

            <br/> <br/>
            <Link to = "../login">Login</Link>
            </div>
        </div>
    );
}

export default Registration;
