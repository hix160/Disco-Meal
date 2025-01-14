import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import RecipeContents from "./RecipeContents";
import AddImg from '../assets/icons/add_24dp.png'
import useRecipes from "../hooks/useRecipes";
import useApiUrl from "../hooks/useApiUrl";
import './styles/Recipes.css'

function Recipes() {
    const { recipeList, isLoading, error, refreshRecipes } = useRecipes();
    const [recipeId, setRecipeId] = useState(null);
    const [showRecipe, setShowRecipe] = useState(false);
    const [addRecipe, setAddRecipe] = useState(false);
    const [deleteRecipe, setDeleteRecipe] = useState(false);
    const [isPublic, setPublic] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const apiUrl = useApiUrl();


    const handlePostRecipe = async (text, title) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const data = recipeId ? 
            {recipeTitle: title, recipeContent: text, userId: user.id, recipeId: recipeId, isPublic: isPublic, deleteRecipe: deleteRecipe} : 
            {recipeTitle: title, recipeContent: text, userId: user.id};
        
        const apiEndpoint = recipeId ? `${apiUrl}/recipe/edit` : `${apiUrl}/recipe`;

        try {
            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setAddRecipe(false);
                setShowRecipe(false);
                setDeleteRecipe(false);
                await refreshRecipes();
            }
        } catch (error) {
            console.error("An error occurred: " + error.message);
        }
    }

    const handleAddButton = () => {
        setAddRecipe(true);
        setShowRecipe(false);
        setSelectedRecipe(null);
        setRecipeId(null);
    }

    const handleOtherButtons = (deleteBtn) => {
        if (!deleteBtn) setPublic(!isPublic);
        else setDeleteRecipe(!deleteRecipe);
    }

    const handleCardClick = (index) => {
        setSelectedRecipe(recipeList[index]);
        setRecipeId(recipeList[index].id);
        setPublic(recipeList[index].is_public);
        setAddRecipe(false);
        setShowRecipe(true);
    }

    return (
        <div className="recipes">
            <div className="sidepanel">
                <h2>Receptes</h2>
                {isLoading ? (
                    <p>Gaidam...</p>
                ) : error ? (
                    <p>Kļūda: {error}</p>
                ) : recipeList.length === 0 ? (
                    <p>Nav recepšu</p>
                ) : (
                    <RecipeCard data={recipeList} handleCard={handleCardClick} />
                )}
                <button 
                    onClick={handleAddButton}
                    className='add-button'
                >
                    <img src={AddImg} alt="+" />
                </button>
            </div>

            {addRecipe && (
                <RecipeContents 
                    saveRecipe={handlePostRecipe}
                />
            )}

            {showRecipe && selectedRecipe && (
                <RecipeContents
                    recipeData={selectedRecipe}
                    saveRecipe={handlePostRecipe}
                    btnClick={handleOtherButtons}
                    isPublic={isPublic}
                />
            )}
        </div>
    )
}

export default Recipes;