import sharImg from '../assets/icons/share_24dp.png';
import deleteImg from '../assets/icons/delete_24dp.png';
import saveImg from '../assets/icons/save_24d.png';

import { useState, useEffect } from "react";

function RecipeContents({ btnClick, saveRecipe, recipeData, isPublic }) {
    const [title, setTitle] = useState(recipeData?.recipe_title || ""); // Handle case where recipeData might be undefined
    const [text, setText] = useState(recipeData?.recipe_content || "");
    const [productList, setProductList] = useState(recipeData?.product_list || "");
    
    const [saveButtonText, setSaveButtonText] = useState('');
    //console.log(recipeData);

    // Use useEffect to update state whenever recipeData changes
    useEffect(() => {
        if (recipeData) {
            setTitle(recipeData.recipe_title || "");
            setText(recipeData.recipe_content || "");
            setProductList(recipeData?.product_list || "");
            
        }
    }, [recipeData]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setSaveButtonText('saglabāt izmaiņas')
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
        setSaveButtonText('saglabāt izmaiņas')
    };

    const handleTextareaKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default new line behavior
            const cursorPos = e.target.selectionStart;
            const value = text;
            const indent = "    "; // Four spaces for indentation (or "\t" for a tab)

            // Insert a newline and indentation
            const newValue =
                value.slice(0, cursorPos) + "\n" + indent + value.slice(cursorPos);

            setText(newValue);

            // Move the cursor after the indent
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd =
                    cursorPos + indent.length + 1;
            }, 0);
        }
    };
//<img src={saveImg} alt="Save" />
    return (
        <div className="recipe-contents">
            <div className="recipe-info">
                <div className="top-part">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                        />
                    <div className='button-container'>
                        <button onClick={() => saveRecipe(text, title)}>
                            
                            <div>{saveButtonText}</div>
                        </button>
                        <button onClick={() => {btnClick(true), setSaveButtonText('Apstiprināt dzēšanu')}}>
                            <img src={deleteImg} alt="Delete" />
                            <div>izdzēst</div>
                        </button>
                        <button onClick={()=> {btnClick(false), setSaveButtonText('saglabāt izmaiņas')}}
                        style={isPublic ? {backgroundColor: 'rgba(0,0,0,.2)'} : {backgroundColor: 'rgba(0,0,0,0)'}}
                        >
                            <img src={sharImg} alt="Share" />
                        </button>
                    </div>
                </div>

                <textarea
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleTextareaKeyDown}
                />
            </div>

            

            <div className="product-list">
                {productList &&
                    Object.entries(productList).map(([storeName, products]) => (
                        <div key={storeName} className="store-section">
                            
                            <h3>{storeName.slice(0,storeName.search('_')).toUpperCase()}</h3>
                            <div className="products">
                                {products.map((product) => (
                                    <div key={product.id} className="product-card">
                                        <li>{product.product_name}</li>
                                        <div className='price'>
                                            <div style={{color:'red'}}>{product.original_price}€</div>
                                            <div style={{color:'green'}}>{product.discount_price}€</div>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default RecipeContents;
