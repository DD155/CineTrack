import './Home.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios'

const path = "http://localhost:3001/" // url for server

const Home = () => {
    return (
        <div className="App">
            <div>
                <h1> Home Page </h1>
            </div>
        </div>
    );
}

export default Home;
