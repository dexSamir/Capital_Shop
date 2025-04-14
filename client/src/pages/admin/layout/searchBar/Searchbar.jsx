import React from 'react'
import { Input, Select } from '@chakra-ui/react'
import styles from "./Searchbar.module.css"; 

function Searchbar({ search, onSearch, onhandleSortByPrice, onhandleSortByName, onhandleSortByDiscount }) {

    const handleInputChange = (e) => {
        onSearch(e.target.value)
    }

    const handleSortOrderChange = (event) => {
        onhandleSortByName(event.target.value)
    }

    const handleSortPriceChange = (event) => {
        onhandleSortByPrice(event.target.value)
    }

    const handleSortDiscountChange = (event) => {
        onhandleSortByDiscount(event.target.value)
    }

    return (
        <div className={styles.Searchbar}>
            <Input 
                placeholder='Search...' 
                className={styles.searchInput}
                value={search} 
                onChange={handleInputChange} 
            />
            <div className={styles.selectDiv}>
                <select
                    placeholder='Name' 
                    className={styles.select}
                    onChange={handleSortOrderChange}
                >
                    <option value='SortByName'>Sort by Name</option>
                    <option value='AtoZ'>A to Z</option>
                    <option value='ZtoA'>Z to A</option>
                </select>
            
                <select 
                    placeholder='Price' 
                    className={styles.select}
                    onChange={handleSortPriceChange}
                >
                    <option value='sortByPrice'>Sort by Price</option>
                    <option value='MintoMax'>Min. to Max.</option>
                    <option value='MaxtoMin'>Max. to Min.</option>
                </select>
                <select 
                    placeholder='Discount' 
                    className={styles.select}
                    onChange={handleSortDiscountChange}
                >
                    <option value='sortByDiscount'>Sort by Discount</option>
                    <option value='MintoMax'>Min. to Max.</option>
                    <option value='MaxtoMin'>Max. to Min.</option>
                </select>
            </div>
        </div>
    )
}

export default Searchbar;
