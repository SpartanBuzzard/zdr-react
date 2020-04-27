import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Link} from 'react-router-dom'

import ProductsAPI from '../APIs/product.api'
import { link } from 'fs'

export default function Pagination({products, setProducts, productsLoaded, setProductsLoaded}) {

    const [currentStart, setCurrentStart] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    // const [products, setProducts] = useState([])
    // const [productsLoaded, setProductsLoaded] = useState(false)

    // useEffect(() => {
    //     ProductsAPI.getAllProducts(setProducts, setProductsLoaded)
    // }, [currentPage])

    function buildLinks() {
        const totalProducts = products.length
        const productsPerPage = 20
        const offset = 2 //should produce no more than three inner links
        let linkCount = 0
        let links = []
        let lastPage = 0
        //Beginning Link
        links.push(<li key={'first'} className="page-item text-center"><Link className="page-link" to={`/resupply`} onClick={()=>{setCurrentPage(1)}}>{'Beginning'}</Link></li>)
        let linkId = 0
        for(let i = 0; i < totalProducts; i++) {
            if(i === 0 || i % productsPerPage === 0) {
                linkId++
                if((Math.abs(currentPage - linkId) < offset)) {
                    
                    let temp = linkId
                    links.push(<li key={i} className={(linkId === currentPage) ? "page-item text-center active" : "page-item text-center"}><Link className="page-link" to={`/resupply/${i}`} onClick= {() => {setCurrentPage(temp)}}>{linkId}</Link></li>)
                    linkCount++
        
                } else {
                    //Add invisible links for instances over linkCount
                    links.push(<li key={i} className={(linkId === currentPage) ? "page-item text-center invisible-link" : "page-item text-center invisible-link"}><Link className="page-link" to={`/resupply/${i}`} onClick= {() => {setCurrentPage(1)}}>{linkId}</Link></li>)
                    lastPage = i
                }
            }
        }
        //Last Link
        links.push(<li key={'last'} className="page-item text-center"><Link className="page-link" to={`/resupply/${lastPage}`} onClick={()=>{setCurrentPage(links.length-2); console.log("Last button sets: " + links.length-1)}}>{'End'}</Link></li>)

        return links
    }

    return (
        <div>
                <h5>Current Page: {currentPage}</h5>
                <ul className="pagination">{productsLoaded ? buildLinks() : "Loading..."}</ul>
        </div>
    )
  
}