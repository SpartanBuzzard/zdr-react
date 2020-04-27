import React from 'react'
import {Redirect} from 'react-router-dom'

export default function MiniCart({cart}) {

    return (
        <div id="mini-cart" onClick={() => {alert('Lets go to Cart')}}>
            <h5 className="text-center">Cart Contents</h5>
            <ul className="mini-cart-list">
                {cart.map(({product, quantity}) => { 
                    return <li><MiniCartItem product={product} quantity={quantity}/></li>
                })}
            </ul>
        </div>
    )

}

function MiniCartItem({product, quantity}) {
    console.log(product.name)
    return (
        <div className="mini-cart-item">
            <div className="name">{product.name}</div>
            <div className="stats">
                <img className="image" src={`/product_images/${product.imageURL}`} alt={product.imageURL}/>
                <div className="quantity">Qty: {quantity}</div>
            </div>
        </div>
    )
}