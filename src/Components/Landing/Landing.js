import './Landing.css';
import React, {useEffect, useState, Button} from 'react';
import { Link, useNavigate } from "react-router-dom";


const Landing = () => {
    const isSignedIn = localStorage.getItem("session") ? true : false
    const navigate = useNavigate()

    const sessionTest = () => {
        if (localStorage.getItem("session")) {
            console.log("Signed in")
        } else console.log('Not signed in')
    }
    sessionTest()

    const logout = () => {
        navigate("/login")
        localStorage.clear()
    }

    return (
    <div className="App">
        <div>
            <h1> Welcome! </h1>
            <Link to = "registration"> Register Here </Link> <br/>
            <Link to = "login"> Login Here </Link>
            {
                isSignedIn ? <button onClick={logout}>Log out</button> : <div></div>
            }
            
        </div>
    </div>
    );
}

export default Landing;
