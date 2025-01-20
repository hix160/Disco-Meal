import { useState, useEffect } from "react";
import useApiUrl from '../hooks/useApiUrl';
import './styles/ShopingList.css'

function ShopingList() {
    const [shopingList, setShopingList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [highlightedItems, setHighlightedItems] = useState({});
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(true);

    const apiUrl = useApiUrl();

    async function fetchShopingList() {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const res = await fetch(`${apiUrl}/shoping/${user.id}`);
            
            if (!res.ok) {
                throw new Error('Failed to fetch shopping list');
            }

            const data = await res.json();
            setShopingList(data);
            console.log(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    }

    async function deleteShopingList() {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const res = await fetch(`${apiUrl}/shoping/${user.id}/delete`);
            
            if (!res.ok) {
                throw new Error('Failed to fetch shopping list');
            }

            setRefresh(!refresh);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchShopingList();
    }, [refresh]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const toggleHighlight = (index) => {
        setHighlightedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    }

    return (
        <div className="ShopingList">
            <h2>Produktu saraksts</h2>
            {shopingList && shopingList.shoping_list ? (
                <div>
                    {shopingList.shoping_list.products.map((product, index) => (

                        <div onClick={() => toggleHighlight(index)} 
                        className="list-item" 
                        key={index}
                        style={{ opacity: highlightedItems[index] ? 0.2 : 1 }}>
                            <h3>{product.product_name}</h3>
                            <div style={{display:'flex', flexDirection:'row', }}>
                                <span style={{color:'red', padding:'0 1vh'}}>{product.original_price}</span>
                                <span style={{color:'green', padding:'0 1vh'}}>{product.discount_price}</span>
                            </div>
                            
                        </div>

                        
                    ))}
                </div>
                
            ) : (
                <p>Saraksts ir tukšs</p>
            )}
            <button onClick={()=>deleteShopingList()}>Dzēst sarakstu</button>
        </div>
    );
}

export default ShopingList;