import React, {Component, useState, useEffect} from 'react';

import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./Assets/css/default.min.css";

import Navbar from './components/navbar.component';
import UsersList from './components/admin-components/users-list.component';
import CreateUser from './components/create-user.component';
import Login from './components/login.component';
import Resupply from './components/resupply.component';
import Cart from './components/cart.component';
import Home from './components/home.component';
import ProtectedRoute from './components/protected-route';
import Unfound404Page from './components/unfound404page.component';

import axios from 'axios';
axios.defaults.withCredentials = true; //Include Session Cookie in headers by default


function App() {

    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    const [cart, setCart] = useState([])
    const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    checkLoginStatus() //Restores App state (loggedIn)
    updateCart() //Restores the Cart state
 //Restores the Cart state
  })
 
  function checkLoginStatus() {
    //Check the login status each time app is accessed via the browser
    axios.get('/users/loginStatus')
      .then(res => {
        if(res.data.loggedIn === true) {
          //User is logged in updated state
          this.setState({
            loggedIn: true,
            user: res.data.user
          })
        }
      })
  }
  function logOut() {
    axios.get("/users/logOut")
      .then(res => {
        if(res.data === 'success') {
          this.setState({
            loggedIn: false, 
            user: {}
          })
          console.log('Successfully Logged Out')
          //Clear React state upon logout
          this.setState({
            loggedIn: false,
            user: {},
            cart: [],
            cartCount: 0
          })
        }
      })
      .catch(err => console.log("Error in logOut: ", err));
  }

  function addToCart(e) {
    e.preventDefault()
    const data = new FormData(e.target)
    let pid = data.get('pid')
    let quantity = data.get('quantity')

    const payload = {
      pid: pid,
      quantity: quantity
    }

    //send request to server
    axios.post('/cart/add', payload)
      .then(res => {
        if(res.data.success) {
          //Update front end cart, set state based on returned cart object
          this.updateCart(res.data.cart)
        }
      })
      .catch(err => console.log("Error posting to cart", err))
  }
  function updateCart(cart = null) {
    if(cart === null) {
      //Grab the current server side state of cart and bring it frontside
      axios.get('/cart')
        .then(res => {
          let count = 0
          if(res.data.cart.length > 0) {
            res.data.cart.forEach(item => {
              count += item.quantity
            })
          }
          console.log("Count is: " + count)
          console.log("Cart is: ", res.data.cart)
          this.setState({
            cart: res.data.cart,
            cartCount: count
          },
          function() {
            console.log("Called updateCart and should have updated the cart count to " + this.state.cartCount)
          })      
        })
        .catch(err => console.log("Error trying to update Cart.", err))
    } else {
      //passed a cart object, no need to fetch from server
      let count = 0
      if(cart.length > 0) {
        cart.forEach(item => {
          count += item.quantity
        })
      }
      console.log("Count is: " + count)
      console.log("Cart is: ", cart)
      this.setState({
        cart: cart,
        cartCount: count
      }) 
    }

  }

  function quantityOptionsResupply(product) {
    //Given a product, determine the quantity values for the resupply page
      //Should only display current stock - number in inventory
      if(product.stock > 0) {
        let limit = 0
        let inCart = false
        let cartQuantity = 0

        this.state.cart.forEach((item, index) => {
          if(item.product._id == product._id) {
            inCart = true
            cartQuantity = item.quantity
          }
        })
        if(inCart) {
          limit = product.stock - cartQuantity
        } else {
          limit = product.stock
        }

        let range = []
        for(let i = 1; i <= limit; i++) {
          range.push(i)
        }
        return range.map(num => {
            return <option key={num} value={num}>{num}</option>
        })
      } 
  }
  function quantityOptionsCart(product, quantity) {
    //Given a cartItem, determine the quantity values for the cart page
      //Should only display current stock - number in inventory * selected value should be current quantity
      let limit = product.stock
      let range = []
      for(let i = 1; i <= limit; i++) {
        range.push(i)
      }
      return range.map(num => {
          if(num === quantity) { //mark current quantity
             return <option key={num} value={num}>{num}</option>
          } else {
            return <option key={num}  value={num}>{num}</option>
          }
      })

  }

  return (
    <Router>
      <div className="container">
        <Navbar {...this.state} logOut = {this.logOut}/>
        <br/>
        <Switch>
          <Route
            exact
            path={"/"}
            render = { props => (
              <Home {...props} state = {this.state}/>
            )}
          />
          <ProtectedRoute path="/login" user={this.user} loggedIn = {!this.state.loggedIn} setLogin = {this.setLogin} setUser = {this.setUser} component={Login} />
          {/* <ProtectedRoute path="/users-list" loggedIn = {this.state.loggedIn} redirectDest = "/login" component={UsersList} />
          <Route path="/register" component={CreateUser} /> */}
          <ProtectedRoute path="/resupply" quantityOptionsResupply={this.quantityOptionsResupply} cartCount={this.state.cartCount} cart={this.state.cart} addToCart={this.addToCart} user={this.state.user} cart={this.state.cart} loggedIn = {this.state.loggedIn} redirectDest = "/login" component={Resupply} />
          <ProtectedRoute path="/cart" quantityOptionsCart={this.quantityOptionsCart} user={this.state.user} updateCart={this.updateCart} cartCount={this.state.cartCount} cart={this.state.cart} loggedIn = {this.state.loggedIn} redirectDest = "/login" component={Cart} />
          <Route component={Unfound404Page} />
        
        </Switch> 
      </div>
    </Router>
  )
}


export default App;
