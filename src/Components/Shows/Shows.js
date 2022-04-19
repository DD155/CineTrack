import './Shows.css';
import React, {useEffect, useState, Button} from 'react';
import { Link, useNavigate } from "react-router-dom";


const Shows = () => {
    const isSignedIn = localStorage.getItem("session") ? true : false
    const navigate = useNavigate()

    return (
    <div className="App">
        <div>
            <h1> Shows! </h1>            
        </div>
    </div>
    );
}

export default Shows;
