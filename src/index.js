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
import Details from './Components/Details/Details.js';
import ScrollToTop from './Components/ScrollToTop.js';
import Collection from './Components/Collection/Collection.js';
import Profile from './Components/Profile/Profile.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <div className = 'bg' style={{/*backgroundColor: '#40434E', */height: '100vh'}}>
            <Navbar/>
            <ScrollToTop/>
            <Routes>
                <Route path="home" element={<Home />} />
                <Route path="registration" element={<Registration />} />
                <Route path="login" element = {<Login />} />
                <Route path="shows" element = {<Shows />} />
                <Route path="movies" element = {<Movies />} />
                <Route path="collection" element = {<Collection />} />
                <Route path="profile" element = {<Profile />} />
                <Route path="details/:type/:id" element = {<Details />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
        </div>
    </Router>
);

