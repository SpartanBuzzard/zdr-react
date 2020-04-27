import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios';

export default function Login({loggedIn, setLoggedIn, setUser, location, history}) {

    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('') 
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('solinsky.chris@gmail.com')
    const [password, setPassword] = useState('lobo2323')
        
    function onChangeEmail(e) {
        setEmail(e.target.value)
    }
    function onChangePassword(e) {
        setPassword(e.target.value)
    }
    function handleSubmit(e) {
        //Grab previous location in event that user was redirected to Login for trying to access forbidden page, we will return the user to the accessed page
        const { state = {} } = location;
        const { prevLocation } = state;

        e.preventDefault();
        const credentials = {
            email: email,
            password: password,
        }

        axios.post('/login', credentials)
            .then(res => {
                if(res.data.loggedIn) { //SUCCESSFULLY LOGGED IN
                    setLoggedIn(true)
                    setUser(res.data.user)
                    history.push(prevLocation || '/') //if prevLocation is set send user there, else send user to home
                }
            })
            .catch(err => console.log(err));

    }

    //Check for a passed error (occurs when user redirected to login for attempted access to protected route)
    const {state = {}} = location;
    const {error} = state;

    return (
    <div>
        <h3 className="text-center">User Login</h3>
        {error && <h5 className="alert alert-warning text-center">{error}</h5>}
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email Address: </label>
                <input type="email"
                    required
                    className="form-control"
                    value={email}
                    onChange={onChangeEmail}
                    />
            </div>
            <div className="form-group">
                <label>Password: </label>
                <input type="password"
                    required
                    className="form-control"
                    value={password}
                    onChange={onChangePassword}
                    />
            </div>
            <div className="form-group">
                <input type="submit" value="Login" className="btn btn-primary" />
            </div>
        </form>   
    </div>  
    )




}