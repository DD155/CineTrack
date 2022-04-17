import './Landing.css';
import React, {useEffect, useState, Button} from 'react';
import { Link } from "react-router-dom";


const Landing = () => {
  return (
    <div className="App">
        <div>
            <h1> Welcome! </h1>
            <Link to = "registration"> Register Here </Link> <br/>
            <Link to = "login"> Login Here </Link>
        </div>
    </div>
  );
}

export default Landing;
