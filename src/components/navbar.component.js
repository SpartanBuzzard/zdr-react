import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../images/mountain_logo_white.png';
import MiniCart from '../components/miniCart.component'

export default function Navbar({loggedIn, logOut, cart, cartCount}) {

    function getLoginLinks() {
        //return logOut button if state says logged in
        if(loggedIn) {
            return (
                <li className="navbar-item">
                    <Link to="/" className="nav-link" onClick={logOut}>Logout</Link>
                </li>
            ) 
        } else {
            return(
                <li className="navbar-item">
                    <Link to="/login" className="nav-link">Login</Link>
                </li>
            )
        }
    }
    function getRegisterLink() {
        if(!loggedIn) {
            return(
            <li className="navbar-item">
                <Link to="/register" className="nav-link">Register</Link>
            </li>
            )
        }
    }
   
    return (
        <div>
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
            <Link to="/" className="navbar-brand"><img src={logo} alt="log" width="100"/></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#menu" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="menu" className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                        <Link to="/about" className="nav-link">About</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/services" className="nav-link">Services</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </li>
                    {loggedIn &&
                        <li className="navbar-item">
                            <Link to="/resupply" className="nav-link">Resupply</Link>
                        </li>
                    }
                    {loggedIn &&
                        <li id="cart-link" className="navbar-item">
                            <Link to="/cart" className="nav-link">Cart ({cartCount})</Link>
                            <MiniCart cart={cart}/>
                        </li>
                    }
                    {loggedIn &&
                        <li className="navbar-item">
                            <Link to="/users-list" className="nav-link">Users List</Link>
                        </li>
                    }
                    {getRegisterLink()}
                    {(loggedIn) ? getLoginLinks(): getLoginLinks()}
                </ul>
                
            </div>
        </nav>
        </div>
        
    )

}