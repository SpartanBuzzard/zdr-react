import React, {useState, useEffect} from 'react';


export default function Searchbar() {

    const [matches, setMatches] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState([])
 
    function listMatches() {
        //Update a list of matches based on what is typed in the searchbar 
        let list = [] //add matches here
        products.forEach(p => {
            console.log(`Checking ${searchTerm}`)
            if(searchTerm.length > 0 && searchTerm.toLowerCase() === p.name.substring(0, searchTerm.length).toLowerCase()) {
                console.log(`${searchTerm} is the same as ${p.name.substring(0, searchTerm.length)}`)
                list.push(p.name)
            }
        })
        setMatches(list)

    }

    function testProducts() {
        if(matches.length > 0) {
            return matches.map(name => {
                return <p key={name}>{name}</p>
            })
        } 
    }
    function searchChange(e) {
        setSearchTerm(e.target.value)
    }
    return (
        <div id="searchbar">
            <h5>I am the Search Bar</h5>
            <input className="form-control" onChange={searchChange} type="text" name="searchbar" value={searchTerm} placeholder="Search for Products and Categories"/>
            {testProducts()}
        </div>
    )
}