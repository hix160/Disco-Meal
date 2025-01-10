import { useState, useEffect } from 'react';
import LoadTable from './LoadTable';
import LoadProducts from './LoadProducts';
import './styles/Discounts.css';

function Discounts() {
    const [tableData, setTableData] = useState(null);
    const [productTableData, setProductTableData] = useState(null);
    const [tableId, setTableId] = useState("maxima_categories");
    const [categorieId, setCategorieId] = useState("41");
    const [tableName, setTableName] = useState("maxima_products");
    const [productTableName, setProductTableName] = useState("Konditorija");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [active, setActive] = useState('');
    const [dropStyle, setDropStyle] = useState({ opacity: '0', visibility: 'hidden', productName:'', productId:'' });

    const [showList, setShowList] = useState(false);
    const [tempText, setTempText] = useState('');
    const [recipeList, setRecipeList] = useState(null);
    
    async function fetchRecipeList() {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'))
            
            const res = await fetch(`/api/recipe/${user.id}`)
            const data = await res.json();
            

            setRecipeList(data);
            
        } catch (err) {console.log(err)}
    }
    

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                if(!recipeList) {
                    fetchRecipeList(); // <+++++++++++++++++++++++ japarveido, sis ielādē konkrētā lietotāja izveidoto recepšu sarakstu
                    
                }

                const cachedData = localStorage.getItem(tableId);
                if (cachedData) {
                    setTableData(JSON.parse(cachedData));
                    return;
                }
                
                const res = await fetch(`/api/load/${tableId}`);
                const data = await res.json();
                setTableData(data);
                localStorage.setItem(tableId, JSON.stringify(data));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [tableId]);

    useEffect(() => {
        async function fetchProd() {
            try {
                setLoading(true);

                const cacheKey = `${tableName}_${categorieId}`;
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    setProductTableData(JSON.parse(cachedData));
                    return;
                }

                const res = await fetch(`/api/load/${tableName}/${categorieId}`);
                const data = await res.json();
                setProductTableData(data);
                console.log(data);
                localStorage.setItem(cacheKey, JSON.stringify(data));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProd();
    }, [categorieId]);

    const handleTableChange = (prefix) => {
        setTableName(`${prefix}_products`);
        setTableId(`${prefix}_categories`);
    };

    const handleProductTableChange = (newCategorieId, newCategorieName) => {
        setProductTableName(newCategorieName);
        setCategorieId(newCategorieId);
    };

    const handleRowClick = (rowId, rowName) => {
        setDropStyle({ opacity: '1', visibility: 'visible' , productName:rowName, productId:rowId});
    };

    const handleActive = (component) => {
        setActive(component);
    };

    const addProductToRecipe = async (recipeId) => {
        setDropStyle({ opacity: '0', visibility: 'hidden'})
        setShowList(false)
        
        const data = {recipeId: recipeId, tableName: tableName, productId: dropStyle.productId};
        
        try {
            await postProductInRecipe(data);
            // Optionally, you can update the UI or state here to reflect the successful addition
            console.log('Product added successfully');
        } catch (error) {
            console.error('Failed to add product:', error);
            // Handle the error, maybe show a message to the user
        }
    }

    async function postProductInRecipe(data) {
        try {
            console.log('Sending request to add product to recipe:', data);
            const response = await fetch('/api/recipe/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add a custom header to track the request
                    "X-Request-ID": Date.now().toString()
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Product added successfully:', result);
            return result;
        } catch (err) {
            console.error('Error adding product to recipe:', err);
            // Optionally, you can set an error state here to display to the user
            setError('Failed to add product to recipe. Please try again.');
        }
    }

    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='discounts'>
            <div className='categories'>
                <h3 className='timeStamp'>Dati atjaunoti: 28/12/2024</h3>
                <div className='button-container'>
                    <button className={active === 'maxima' ? 'active' : ''} onClick={() => { handleTableChange("maxima"), handleActive('maxima') }}>Maxima</button>
                    <button className={active === 'rimi' ? 'active' : ''} onClick={() => { handleTableChange("rimi"), handleActive('rimi') }}>Rimi</button>
                </div>
                {tableData && (
                    <LoadTable
                        tableId={tableId}
                        tableData={tableData}
                        haveButtons={true}
                        onCategorieClick={handleProductTableChange}
                    />
                )}
            </div>
            <div className='products'>
                {productTableData && (
                    <LoadProducts
                        productTableData={productTableData}
                        productTableName={productTableName}
                        btnClick={handleRowClick}
                    />
                )}
                
            </div>

            
            <div className='drop-down' style={{opacity:dropStyle.opacity, visibility:dropStyle.visibility}}>
                <div style={{padding:'1vh'}}>{dropStyle.productName}</div>
                

                    {showList ? (
                        recipeList && (
                            <div style={{display:'flex', flexDirection:'column', gap:'1vh'}}>
                                {recipeList.map((row, index)=>(
                                    <button 
                                    key={index}
                                    onClick={()=> {addProductToRecipe(row.id)}} 
                                    >{row.recipe_title}</button>
                                    
                                ))}
                                <button onClick={() => { setShowList(false)}}>Atpakaļ</button>
                            </div>
                            
                        )
                         
                    ):(
                        <div style={{display:'flex', flexDirection:'column', gap:'1vh'}}>
                            <button onClick={()=>{setShowList(true)}}>Pievienot Receptei </button>
                            <button onClick={()=>{setTempText('Pievienots sarakstam')}}>Pievienot Sarakstam</button>
                            <button onClick={() => {setDropStyle({ opacity: '0', visibility: 'hidden'}), setTempText('')}}>Atcelt</button>
                        </div>
                        
                    )}

                    

                    
                    
                    

                

                
                <div>{tempText}</div>
            </div>
            
        </div>
    );
}

export default Discounts;
