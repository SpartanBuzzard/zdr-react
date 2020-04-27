import React from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios';

export default function Cart({cart, updateCart, quantityOptionsCart, ...rest}) {

    function updateCartItem(e) {
        e.preventDefault()
        const data = new FormData(e.target)
        let pid = data.get('pid')
        let quantity = data.get('quantity')
        let payload = {
            pid: pid,
            quantity: quantity
        }

        axios.post('/cart/update', payload)
            .then(res => {
                if(res.data.success) {
                    updateCart(res.data.cart)
                }
            })
            .catch(err => console.log("Error updating cart quantity", err))
  
    }
    function removeCartItem(e) {
        e.preventDefault()
        const data = new FormData(e.target)
        let pid = data.get('pid')
        let payload = {
            pid: pid
        }

        axios.post('/cart/remove', payload)
            .then(res => {
                if(res.data.success) {
                    updateCart(res.data.cart)
                }
            })
            .catch(err => console.log("Error removing item from cart.", err))
        
    }

    function cartContents() { //Display table of cart contents
        if(cart.length > 0) {
            return (
                cart.map(item => {
                    return <CartItem 
                            key={item.product._id} 
                            {...item} 
                            quantityOptionsCart={quantityOptionsCart} 
                            updateCartItem={updateCartItem}
                            removeCartItem={removeCartItem}
                            />
                })
            )
        } else {
            return (
                <div className="alert alert-warning text-center">No items in cart.</div>
            )
        }
    }

    function cartTotals() {
        let costTotal = 0
        let proteinTotal = 0
        cart.forEach(item => {
            costTotal += (item.product.price * item.quantity)
            proteinTotal += (item.product.protein * item.quantity) 
        })

        return (
            <div>
                <div className="price">Item Subtotal: ${costTotal.toFixed(2)}</div>
                <div>Protein Total: {proteinTotal}</div>
            </div>
        )
    }

    return(
        <div id="cart-contents" className="container-fluid">
            <h1 className="text-center">Cart Contents</h1>
            <div id="cart-totals">
                {cartTotals()}
            </div>
            {cartContents()}
            <div className="bottom-buttons">
                <div className="row">
                    <div className="col-sm">
                        <Link to='/resupply'><button type="button" className="btn btn-default cart-btn">Continue Resupply</button></Link>
                    </div>
                    <div className="col-sm">
                        <Link to='/checkout' className="btn btn-warning cart-btn">Checkout</Link>
                    </div>
                </div>
            </div>

        </div>
    )
    
}

const CartItem = ({product, quantity, quantityOptionsCart, updateCartItem, removeCartItem}) => {

    return (
        <div className="cart-item">
                <div className="image-div">
                    <img className="image" src={`/product_images/${product.imageURL}`} alt={product.imageURL}/>
                </div>
                <div className="name">{product.name}</div>
                <div className="price">{product.price.toFixed(2)}</div>
                <div className="controls">
                <form onSubmit={updateCartItem}>
                    <input type="hidden" value={product._id} name="pid"/>
                    <div className="quantity-group">
                        <label htmlFor="quantity">Quantity: </label>
                        <select name="quantity" defaultValue={quantity}>
                            {quantityOptionsCart(product, quantity)}
                        </select>
                    </div>
                    <button type="submit" name="update" value="update">Update</button>
                </form>
                <form onSubmit={removeCartItem}>
                    <input type="hidden" value={product._id} name="pid"/>
                    <button type="submit" name="remove" value="remove">Remove</button>
                </form>
                </div>
        </div>

    )
}