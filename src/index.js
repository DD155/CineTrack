import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from './Components/Navbar/Navbar.js';
import Registration from './Components/Authentication/Registration.js';
import Login from './Components/Authentication/Login.js';
import Home from './Components/Home/Home.js';
import Shows from './Components/Shows/Shows.js';
import Movies from './Components/Movies/Movies.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <div style={{/*backgroundColor: '#40434E', */height: '100vh'}}>
            <Navbar/>
            <Routes>
                <Route path="home" element={<Home />} />
                <Route path="registration" element={<Registration />} />
                <Route path="login" element = {<Login />} />
                <Route path="shows" element = {<Shows />} />
                <Route path="movies" element = {<Movies />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
        </div>
    </Router>
);

