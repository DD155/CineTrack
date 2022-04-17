import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"

import Registration from './Components/Authentication/Registration.js';
import Login from './Components/Authentication/Login.js';
import Landing from './Components/Landing/Landing.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="registration" element={<Registration />} />
            <Route path="login" element = {<Login />} />
        </Routes>
    </Router>
);

