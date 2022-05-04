import React from 'react'
import './Navbar.css'
import logo from "../../assets/logo.png"
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const isSignedIn = localStorage.getItem("session") 
    const navigate = useNavigate()
     
    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }
    
    return (
        <nav className="NavbarItems font-style-Alice" style = {{backgroundColor: 'black'}}>
            <h1 className="navbar-logo"><img className="image" src={logo} alt="Logo" /></h1>
            <ul className= 'nav-menu'>
                <li>
                    <Link className={'nav-links'} to={'/home'}> Home </Link>
                </li>
                <li>
                    <Link className={'nav-links'} to={'/movies'}> Movies </Link>
                </li>
                <li>
                <Link className={'nav-links'} to={'/shows'}> Shows </Link>
                </li>
                {isSignedIn ?
                <li> <Link className={'nav-links'} to={'/collection'}> Collection </Link></li> 
                 : 
                <li> <Link className={'nav-links'} to={'/login'}> Login </Link></li>}
                {isSignedIn ?
                <li> <Link className={'nav-links'} to={'/profile'}> Profile </Link></li> 
                 : ''} 
                {isSignedIn ?
                <li><Link className={'nav-links'} to={'/home'} onClick={logout}> Logout </Link> </li> 
                 : ''}
            </ul>
        </nav>
    )
}

export default Navbar