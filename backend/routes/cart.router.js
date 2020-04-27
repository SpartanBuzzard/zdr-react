const router = require('express').Router();
const Product = require('../models/product.model');

router.route('/').get((req, res) => { //return current state of cart on server side
    console.log("Checking the cart Status")///, req.session.cart)
    res.json({cart: req.session.cart})
})

router.route('/add').post((req, res, next) => {

    const pid = req.body.pid
    const quantity = parseInt(req.body.quantity)
    
    if(req.session.cart.length > 0) {
        //Check for Items in Cart
        let found = false
        req.session.cart.forEach((item, index, cart) => {
            if(item.product._id == req.body.pid) {
                //Increase Quantity of Existing Item
                console.log('Should increase quantity, item already in cart')
                cart[index].quantity += quantity
                found = true
                res.json({success: 'success', cart: req.session.cart})
            } 
        })
        if(!found) {
            //Add the New Item
            Product.findById(pid)
                .then(product => {
                    req.session.cart.push({product: product, quantity: quantity})
                    res.json({success: 'success', cart: req.session.cart})
                })
                .catch(err => console.log("Error finding product by id", err))
        }
    } else {
        //No Items in Cart... Add Item
        Product.findById(pid)
            .then(product => {
                req.session.cart.push({product, quantity: quantity})
                res.json({success: 'success', cart: req.session.cart})
            })
            .catch(err => console.log("Error Adding Item to Cart", err))
    }       
    
})

router.route('/update').post((req, res) => {
    const pid = req.body.pid
    const quantity = parseInt(req.body.quantity)

    let cart = req.session.cart
    cart.forEach(item => {
        if(item.product._id === pid) {
            item.quantity = quantity
            res.json({success: true, cart: cart})
        }
    })

})

router.route('/remove').post((req, res) => {
    const pid = req.body.pid

    let cart = req.session.cart
    cart.forEach((item, index) => {
        if(item.product._id === pid) {
            cart.splice(index, 1) //remove item from cart
            res.json({success: true, cart: cart})
        }
    })

})


module.exports = router;