import './Home.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios'

const path = "http://localhost:3001/" // url for server

const Home = () => {

    const sessionTest = () => {
        if (localStorage.getItem("session")) {
            console.log("a")
            document.getElementById('session').innerHTML = "User logged in"
        }
        else "User not logged in"
    }
    sessionTest()
    return (
        <div className="App">
            <div>
                <h1> Home Page </h1>
                <div id = 'session'></div>
            </div>
        </div>
    );
}

export default Home;
