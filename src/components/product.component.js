import React, {useState} from 'react'

export default function Product({cart, product, quantityOptionsResupply, addToCart}) {

    const [checked, setChecked] = useState(false)
 
    
    function checkMark(e) { //Apply a Check Mark to the Product added to Cart
        e.preventDefault()
        setChecked(true)
        setTimeout(()=> {
            setChecked(false)
        }, 1500)
    }

    function stockAlert(product) { //Handle Stock Alerts for "Out of Stock", "Available Quantity in Cart"
        let spokenFor = false
        cart.forEach((item, index) => {
            if(product._id === item.product._id) { //product in cart
                if(product.stock === item.quantity) {
                    spokenFor = true
                }
            }
        })
        if(product.stock > 0) { //In Stock
            if(spokenFor) {
                return <span className="alert-warning stock-alert">Available Quantity in Cart</span>
            }
            return <span><select name="quantity" className="quantityField">
                        {quantityOptionsResupply(product)}
            </select><button className="btn btn-info" type="submit" value={product._id}>Add to Cart</button></span>
        } else { //Out of Stock
            return <span className="alert-warning stock-alert">Out of Stock</span>
        }
    }

    return (
        <div key={product._id} className="product">
            
            <form onSubmit={(e)=> {addToCart(e); checkMark(e)}}>
                <div className="name">{product.name}</div>
                <div className="price">{product.price.toFixed(2)}</div>
                <div className="image-div">
                    {checked && <img className="image add-to-cart-checkmark" src={'/green-checkmark.png'} alt="checkmark"/>}
                    <img className="image" src={`/product_images/${product.imageURL}`} alt={product.imageURL}/>
                </div>
                <div className="inputs">
                    <input name="pid" type="hidden" value={product._id} />
                    {stockAlert(product)}
                </div>
            </form>
        </div>
    )

}
