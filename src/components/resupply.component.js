import React, {useState, useEffect} from 'react'

//Component Imports
import Product from './product.component'
import Searchbar from './searchbar.components'
import Pagination from './pagination.components'

//Function Imports
import ProductAPI from '../APIs/product.api'

export default function Resupply({products, setProducts, productsLoaded, setProductsLoaded, cart, quantityOptionsResupply, addToCart, ...rest}) {

    const [start, setStart] = useState('')
    // const [products, setProducts] = useState([])
    // const [productsLoaded, setProductsLoaded] = useState(false)
        
    useEffect(()=> { //Should fire each time a resupply page is requested
        setStart(rest.match.params.start)
        // ProductAPI.loadProducts({start: rest.match.params.start, setProducts, setProductsLoaded})
    },[rest.match.params.start])


    function displayProducts() {

        if(products.length > 0) {
            const list = products.slice(start, start+20)
        
             list = list.map((product) => {
                return <Product cart={cart} quantityOptionsResupply={quantityOptionsResupply} addToCart={addToCart} product={product} key={product._id} />
            })
            return list ///test git
        } 

    }

    return(
        <div>
            <h1 className="text-center">Resupply</h1>
            <Pagination products={products} setProducts={setProducts} productsLoaded={productsLoaded} setProductsLoaded={setProducts}/>
            <div id="shop">
                <Searchbar setProducts={setProducts}/>
                <div id="product-list">
                    {(productsLoaded) ? displayProducts() : "Loading..."}
                </div>
            </div>
        </div>
    )
}