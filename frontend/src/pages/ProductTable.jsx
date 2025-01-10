import { useState, useEffect} from 'react';
import LoadTable from './components/LoadTable';
import LoadProducts from './components/LoadProducts';
import './App.css';


function App() {
  
  const [tableData, setTableData] = useState(null);
  const [productTableData, setProductTableData] = useState(null);

  const [tableId, setTableId] = useState("maxima_categories");
  const [categorieId, setCategorieId] = useState("41");
  const [tableName, setTableName] = useState("maxima_products");
  const [productTableName, setProductTableName] = useState("Konditorija");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(()=> {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/load/${tableId}`);
        

        const data = await res.json();
        
        setTableData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false)
      }
    }
    fetchData();

  }, [tableId]);

  useEffect(()=> {
    async function fetchProd() {
      try {
        setLoading(true);
        const res = await fetch(`/api/load/${tableName}/${categorieId}`);
        const data = await res.json();
        setProductTableData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProd()
  }, [categorieId]);

  const handleTableChange = (prefix) => {
    setTableName(`${prefix}_products`);
    setTableId(`${prefix}_categories`);
  };

  if(loading) {
    return <div>Loading...</div>;
  };

  if(error) {
    return <div>Error: {error}</div>;
  };

  const handleProductTableChange = (newCategorieId, newCategorieName) => {
    setProductTableName(newCategorieName);
    setCategorieId(newCategorieId);
  }

  //ir jasalabo body, jo body nevar but child of div
  
  return (
    <div className="App">
      <header>
        <h1>Discount Meal</h1>
        <div className='btn-container'>
          <button className='btn-categories' onClick={()=>handleTableChange("maxima")}>Maxima</button>
          <button className='btn-categories' onClick={()=>handleTableChange("rimi")}>Rimi</button>
          
        </div>
      </header>
      <body> 
        
        {tableData && <LoadTable tableId={tableId} tableData={tableData} haveButtons={true} onCategorieClick={handleProductTableChange}/>}
        {productTableData && <LoadProducts productTableData={productTableData} productTableName={productTableName} />}
        
        
      </body>
      
    </div>
  );
}

export default App;
