import React, {useState, useEffect} from 'react';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
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
import ProductsAPI from './APIs/product.api'

import axios from 'axios';
axios.defaults.withCredentials = true; //Include Session Cookie in headers by default


function App() {

    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    const [cart, setCart] = useState([])
    const [cartCount, setCartCount] = useState(0)
    const [products, setProducts] = useState([])
    const [productsLoaded, setProductsLoaded] = useState(false)

  useEffect(() => {
    ProductsAPI.getAllProducts(setProducts, setProductsLoaded)
  },[]) //Load all products the first time App is loaded

  useEffect(() => {
    console.log("FIRING USE EFFECT IN APP.JS")
    checkLoginStatus() //Restores App state (loggedIn)
    updateCart() //Restores the Cart state
  },[loggedIn])

  function checkLoginStatus() {
    //Check the login status each time app is accessed via the browser
    axios.get('/users/loginStatus')
      .then(res => {
        if(res.data.loggedIn === true) {
          //User is logged in updated state
          setLoggedIn(true)
          setUser(res.data.user)
        }
      })
  }
  function logOut() {
    axios.get("/users/logOut")
      .then(res => {
        if(res.data === 'success') {
          setLoggedIn(false) //Change loggedIn status
          setUser({}) //Clear the User Info
          console.log('Successfully Logged Out')
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
          updateCart(res.data.cart)
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
            setCartCount(count)
            setCart(res.data.cart)
          }                
        })
        .catch(err => console.log("Error trying to update Cart.", err))
    } else {
      //passed a cart object, no need to fetch from server
      let count = 0
      if(cart.length > 0) {
        cart.forEach(item => {
          count += item.quantity
        })
        setCartCount(count) //Update Cart Count
        setCart(cart)
      } else {
        setCartCount(0)
        setCart([]) //Set Cart to empty array
      }
    }
  }

  function quantityOptionsResupply(product) {
    //Given a product, determine the quantity values for the resupply page
      //Should only display current stock - number in inventory
      if(product.stock > 0) {
        let limit = 0
        let inCart = false
        let cartQuantity = 0

        cart.forEach((item, index) => {
          if(item.product._id === product._id) {
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
        <Navbar loggedIn={loggedIn} logOut={logOut} cart={cart} cartCount={cartCount}/>
        <br/>
        <Switch>
{/* Home Route is not protected. Accessed even when user not logged in. loggedIn status passed for conditional rendering      */}
          <Route
            exact
            path={"/"}
            render = { (props) => (
              <Home {...props} user={user} loggedIn={loggedIn}/>
            )}
          />
{/* Register and Login Routes are protected in reverse. The opposite of loggedIn status is passed to allow access when user is NOT LOGGED IN */}
          <ProtectedRoute 
            path="/register" 
            loggedIn={!loggedIn} 
            component={CreateUser} 
          />
          <ProtectedRoute 
            path="/login" 
            user={user} 
            loggedIn = {!loggedIn} 
            setLoggedIn = {setLoggedIn} 
            setUser = {setUser} 
            component={Login} 
          />
{/* Protected Routes... only logged in user can access */}
          <ProtectedRoute
            path="/resupply" 
            exact = {true}
            redirectDest = "/login" 
            loggedIn = {loggedIn}
            quantityOptionsResupply={quantityOptionsResupply} 
            cartCount={cartCount} 
            cart={cart} 
            addToCart={addToCart} 
            user={user} cart={cart}  
            component={Resupply}
            products={products} setProducts={setProducts} productsLoaded={productsLoaded} setProductsLoaded={setProducts} 
              
          />
          <ProtectedRoute
            path="/resupply/:start" 
            exact = {true}
            redirectDest = "/login" 
            loggedIn = {loggedIn}
            quantityOptionsResupply={quantityOptionsResupply} 
            cartCount={cartCount} 
            cart={cart} 
            addToCart={addToCart} 
            user={user} cart={cart}  
            component={Resupply}
          />
          <ProtectedRoute 
            path="/cart" 
            redirectDest = "/login" 
            loggedIn = {loggedIn}
            quantityOptionsCart={quantityOptionsCart} 
            updateCart={updateCart} 
            cartCount={cartCount} 
            cart={cart}          
            component={Cart} 
          />
          <ProtectedRoute 
            path="/users-list" 
            loggedIn = {loggedIn} 
            redirectDest = "/login" 
            component={UsersList} 
          />
{/* Default Route... 404 Page displayed for any attempted access outside specified routes            */}
          <Route component={Unfound404Page} />
        </Switch> 
      </div>
    </Router>
  )
}


export default App
