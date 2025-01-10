import { useState, useEffect, useCallback } from 'react';

function useRecipes() {
  const [recipeList, setRecipeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const result = await fetch(`/api/recipe/${user.id}`);
      if (!result.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await result.json();
      console.log(data);
      setRecipeList(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const refreshRecipes = useCallback(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return { recipeList, isLoading, error, refreshRecipes };
}

export default useRecipes;