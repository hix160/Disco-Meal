
const pool = require("./pool");

async function getTable(tableName) {
    const {rows} = await pool.query(`SELECT * FROM ${tableName};`);
    return rows;
}

async function getProducts(tableName, categorieId) {
    const {rows} = await pool.query(`SELECT * FROM ${tableName} WHERE category_id = '${categorieId}'`);
    return rows;
}

async function insertUsernameAndPassword(username, password) {
    try {
        // Insert the user into the 'users' table
        const userQuery = `
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING id, username, password
        `;
        const userValues = [username, password];
        const userResult = await pool.query(userQuery, userValues);

        // Get the user's ID from the result
        const userId = userResult.rows[0].id;

        // Insert a row into the 'users_config' table
        const configQuery = `
            INSERT INTO users_config (user_id, load_recipes, settings)
            VALUES ($1, $2, $3)
        `;
        const configValues = [userId, '', '']; // Default values for the config table
        await pool.query(configQuery, configValues);

        return userResult.rows[0]; // Return the user data
    } catch (error) {
        console.error('Error inserting user and user config into the database:', error);
        throw error;
    }
}




async function getUser(username) { //can be used for checking if the username exists
    try {
        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];

        const {rows} = await pool.query(query, values);

        if (!rows.length) {
            return null;
        }
        else {
            return rows[0];
        }
        
        
    } catch (error) {
        console.error('Error retrieving user: ', error);
        throw error;
    }
}

async function insertRecipe(recipeTitle, recipeContent, userId) {
    try {
        let query = `
            INSERT INTO recipes (recipe_title, recipe_content, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        let values = [recipeTitle, recipeContent, userId]; // Insert the recipe
        const result = await pool.query(query, values); // Execute the query

        //console.log(result.rows); // Log the inserted row(s)

        updateRecipeList(userId);

        return result.rows[0]; // Return the first inserted row
    } catch (error) {
        console.error('Error inserting recipe into the database: ', error);
        throw error;
    }
}

async function addProductToRecipe(jsonData, recipeId) {
    
    try {
        const query = `
        UPDATE recipes
        SET product_list = $1
        WHERE id = $2;
    `
    await pool.query(query,[jsonData, recipeId]);


    } catch (err) {
        throw err;
    }
}

async function editRecipe(recipeTitle, recipeContent, recipeId, isPublic, deleteRecipe, userId) {

    if(deleteRecipe) {
        try {
            const query = `
                DELETE FROM recipes
                WHERE id = $1;
            `
            await pool.query(query, [recipeId]);
            updateRecipeList(userId);
            return;
        } catch (error) {
            throw(error)
        }
    }

    
    

    try {
        let query = `
            UPDATE recipes
            SET recipe_title = $1,
                recipe_content = $2,
                is_public = $3
            WHERE id = $4;
        `

        await pool.query(query, [recipeTitle, recipeContent, isPublic, recipeId]);
    } catch (error) {
        throw error;
    }
}


async function updateRecipeList(userId) {

    try{
        let query = `
            SELECT * FROM users_config WHERE user_id = $1
                   
        `;
        const userConfig = await pool.query(query, [userId]);

        query = `
            SELECT * FROM recipes WHERE user_id = $1
        `;

        const recipes = await pool.query(query, [userId]);

        let recipeList = '';
        for (let i=0; i < recipes.rows.length; i++) {
            //console.log('hallo?'+recipes.rows[i].id)
            recipeList = recipeList + `${recipes.rows[i].id};`
        }

        query = `
            UPDATE users_config
            SET load_recipes = $1
            WHERE user_id = $2;
        `
        await pool.query(query, [recipeList, userId]);
    } catch (error) {
        throw error;
    }
}

async function getRecipe(recipeId) {
    try {
        const query = `
            SELECT * FROM recipes WHERE id = $1
        `;
        const result = await pool.query(query, [recipeId]);
        
        
        return result.rows[0];

    } catch (error) {
        throw(error);
    }
}

async function getRecipes(userId) {
    
    try {
        const query = `
            SELECT * FROM recipes WHERE user_id = $1
        `;

        const result = await pool.query(query, [userId]);
        
        return result.rows;

    } catch (error) {
        throw(error);
    }

}

async function getProductsFromList(tableName, productList) {
    try {
        const query = `
            SELECT * FROM ${tableName} WHERE id = ANY($1::int[]);
        `;
        const result = await pool.query(query, [productList]);
        return result.rows;
    } catch (err) {
        throw err;
    }
}

async function getOneProduct(tableName, productId) {
    try {
        const query = `
            SELECT * FROM ${tableName} WHERE id = $1;
        `
        const result = await pool.query(query, [productId]);
        //console.log(result.rows[0]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

async function updateShoppingList(userId, shopingList) {

    try {
        const query = `
            UPDATE users_config
            SET shoping_list = $1
            WHERE user_id = $2;
        `
        await pool.query(query,[shopingList,userId])
    } catch (err) {
        throw err;
    }

}

async function getShoppingList(userId) {
    try {
        const query = `
            SELECT shoping_list FROM users_config WHERE user_id = $1; 
        `
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

async function deleteRecipe(recipeId) {
    try {
        const query = `
            DELETE FROM recipes
            WHERE id = $1;
        `
        await pool.query(query, [recipeId]);
    } catch (error) {
        throw(error)
    }
}

async function deleteShopingList(userId) {
    try {
        const query = `
            UPDATE users_config 
            SET shoping_list = NULL 
            WHERE user_id = $1;
        `
        await pool.query(query, [userId])

    } catch (err) {
        throw err;
    }
}

async function testDbConnection() {
    try {
        const result = await pool.query('SELECT * FROM maxima_categories;');
        console.log('Connected to the PostgreSQL server');
        return result.rows;
    } catch (error) {
        console.error('Error connecting to the PostgreSQL server:', error);
    }
}




/*

async function addToShopingList(params) {
    try {

    }
}

async function removeFromShopingList(params) {

}
*/

module.exports = {
    getTable,
    getProducts,
    insertUsernameAndPassword,
    getUser,
    insertRecipe,
    getRecipes,
    editRecipe,
    addProductToRecipe,
    getRecipe,
    getProductsFromList,
    testDbConnection,
    getOneProduct,
    updateShoppingList,
    getShoppingList,
    deleteShopingList,
    
}