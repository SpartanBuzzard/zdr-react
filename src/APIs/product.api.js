import axios from 'axios'
import Product from '../components/product.component'

class ProductAPI {

    getAllProducts(setProducts, setProductsLoaded) {
        axios.get('/products')
            .then(res => {
                if(res.data.found) {
                    setProducts(res.data.products)
                    setProductsLoaded(true)
                }
            })
            .catch(err => console.log("Error getting products", err))
    }

    loadProducts({start=0, limit=20, setProducts, setProductsLoaded}) {
        //TODO: Implement a Loader to take the place of the products loading

        console.log('Receiving start of:', start)

        axios.get(`/products/pagination/${start}/${limit}`)
            .then(res => {
                if(res.data.found) {
                    setProducts(res.data.products)
                    setProductsLoaded(true)
                    console.log('loaded')
                } else {
                    console.log("Nothing returned from products route")
                }
            })
            .catch(err => console.log("Error Loading Products", err))

            return true
    }

}

export default new ProductAPI()