import { useState } from 'react';
import PropTypes from 'prop-types';
import SearchBar from './SearchBar';

function LoadProducts({ productTableData, productTableName, btnClick }) {
    const [query, setQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSearch = (newQuery) => {
        setQuery(newQuery);
    };

    const handleSort = (key, isNumeric) => {
        setSortConfig((prevConfig) => {
            const direction = prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc';
            return { key, direction, isNumeric };
        });
    };

    const sortData = (data) => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];

            if (sortConfig.isNumeric) {
                const numA = parseFloat(valueA) || 0;
                const numB = parseFloat(valueB) || 0;
                return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
            } else {
                return sortConfig.direction === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
        });
    };

    // Precompute the "discount_percent" column
    const enrichedData = productTableData.map((row) => ({
        ...row,
        discount_percent: row.discount_price === '0'
            ? 0
            : Math.round((row.original_price - row.discount_price) / row.original_price * 100),
    }));

    // Filter data based on multi-word query
    const filterData = (data) => {
        if (!query) return data;

        // Split the query into individual words
        const searchTerms = query.toLowerCase().split(/\s+/); // Splits by spaces

        // Filter rows that match all search terms
        return data.filter((row) =>
            searchTerms.every((term) =>
                row.product_name.toLowerCase().includes(term)
            )
        );
    };

    // Filter and sort the data
    const displayedData = sortData(filterData(enrichedData));

    return (
        <div className="LoadProducts">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '40%' }}>
                <h3>{productTableName}</h3>
                <SearchBar onSearch={handleSearch} />
            </div>

            {displayedData && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id', true)}>Nr.</th>
                                <th onClick={() => handleSort('product_name', false)}>Produkta nosaukums</th>
                                <th onClick={() => handleSort('original_price', true)}>Cena</th>
                                <th onClick={() => handleSort('discount_price', true)}>Atlaides cena</th>
                                <th onClick={() => handleSort('discount_percent', true)}>Atlaide %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedData.map((row, index) => (
                                <tr key={index} onClick={() => btnClick(row.id, row.product_name)}>
                                    <td>{row.id}</td>
                                    <td>{row.product_name}</td>
                                    <td>{row.original_price}</td>
                                    <td>{row.discount_price}</td>
                                    <td>{row.discount_percent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

LoadProducts.propTypes = {
    productTableData: PropTypes.array.isRequired,
    productTableName: PropTypes.string.isRequired,
};

export default LoadProducts;
