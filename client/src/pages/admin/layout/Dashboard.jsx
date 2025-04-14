import React, {useState, useEffect} from 'react'
import Searchbar from './searchBar/Searchbar'
import Table from "./table/Table"; 
import { getAllproducts } from '../../../middleware/products';
import {deleteProducts} from '../../../middleware/products';

function Dashboard() {
    const [search, setSearch] = useState(''); 
    const [products, setProducts] = useState([]); 
    const [sortByName, setSortByName] = useState(''); 
    const [sortByPrice, setSortByPrice] = useState(''); 
    const [sortByDiscount, setSortByDiscount] = useState(''); 


    useEffect(() => {
        getAllproducts().then(res => 
            // console.log(res); 
            setProducts(res)
        )
    }, [])

    const handleSearch = (search) => {
        setSearch(search); 

    }

    const handleSortByDiscount = (order) => {
        setSortByDiscount(order)
    }

    const handleSortByName = (order) => {
        setSortByName(order); 
    }

    const handleSortByPrice = (order) => {
        setSortByPrice(order); 
    }
    
    const filteredProducts = products.filter(item => {
        const machesSearch = item.name.toLowerCase().includes(search.toLowerCase()); 
        return machesSearch; 
    }).sort((a,b) => {
        if(sortByName == "SortByName") return a.id - b.id; 
        if(sortByName == "AtoZ") return a.name.localeCompare(b.name) 
        if(sortByName == "ZtoA") return b.name.localeCompare(a.name); 
    })
    .sort((a,b) => {
        if(sortByPrice == "sortByPrice") return a.id - b.id; 
        if(sortByPrice == "MintoMax") return a.price - b.price
        if(sortByPrice == "MaxtoMin") return b.price  - a.price  
    })
    .sort((a,b) => {
        if(sortByDiscount == "sortByDiscount") return a.id - b.id; 
        if(sortByDiscount == "MintoMax") return (b.price / b.withoutDiscount * 100) - (a.price / a.withoutDiscount * 100)
        if(sortByDiscount == "MaxtoMin") return (a.price / a.withoutDiscount * 100) - (b.price / b.withoutDiscount * 100)
    });

    

    const handleDelete = (id) => {
        let arr = [...products];
        arr  = arr.filter(item => item.id != id); 
        setProducts(arr); 
        deleteProducts(id)
    }
    
    return (
        <div>
            <Searchbar 
                search ={search}
                onSearch = {handleSearch}
                onhandleSortByPrice={handleSortByPrice} 
                onhandleSortByName={handleSortByName} 
                onhandleSortByDiscount = {handleSortByDiscount}
            />
            <Table 
                onDelete = {handleDelete}
                datas ={filteredProducts}
            />
        </div>
    )
}

export default Dashboard