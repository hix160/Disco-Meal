
const db = require("../db/queries");
const bcrypt = require('bcrypt');

async function loadHome(req,res) {
    
    res.render("index");
}

async function loadData(req, res) {
    try {

        const tableId = req.params.tableId;
        console.log(`Fetching data for table: ${tableId}`);
        // Fetch data from the database using getTable function
        const tableData = await db.getTable(tableId);  // Replace with the actual table you want to fetch data from
        
       
        console.log("Fetching data from db");

        // Send the data as a JSON response to the frontend
        res.json(tableData);
    } catch (error) {
        // In case of an error, send a 500 status code with an error message
        console.error("Error fetching data: ", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

async function loadProdutsTable(req, res) {
    try {
        const tableName = req.params.tableName
        const categorieId = req.params.categorieId;

        const tableData = await db.getProducts(tableName, categorieId);
        console.log("Fetching products from db");
        
        res.json(tableData);
    } catch (error) {
        console.error("Error fetching products: ", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

async function registerUser(req, res) {
    try {
        const {username, password} = req.body;

        const userData = await db.getUser(username);

        if(userData === null) { //checks if username already exists

            const hashedPassword = await hashPassword(password)
            const result = await db.insertUsernameAndPassword(username, hashedPassword);
            console.log("User created: ",result);
            res.status(201).json({message: "User registered"});
            
            
        }
        else {
            console.log("Lietotāj vārds jau eksistē")
            res.status(401).json({message:"Lietotāj vārds jau eksistē"})
        }

        

    } catch (error) {
        console.log("Error inserting user to the databse: ", error);
        res.status(500).json({error:"Failed to register"});
    }

}

async function loginUser(req, res) {
    try {
        const {username, password} = req.body;
        
        const userData = await db.getUser(username);
        

        if(userData) {
            const isMatch = await verifyPassword(password, userData.password);
            if(isMatch) {
                res.status(201).json({id: userData.id, username: userData.username});
            }
            else {
                res.status(401).json({message: "Nepareiza parole!"})
            }
        }
        else {
            res.status(404).json({message: "Nav tāda lietotāja"})
        }

    } catch (error) {
        console.error("Error while loging in: ", error);
        throw error;
    }
}

async function verifyPassword(enteredPassword, storedHashedPassword) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error while verifying password: ", error);
        throw error;
    }
    
}

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error while hashing password: ", error);
        throw error;
    }
}

async function updateRecipeProductList(req,res) {
    try { //recipeId:recipeId, tableName:dropStyle.productId
        const {recipeId, tableName, productId} = req.body;
        
        const result = await db.getRecipe(recipeId);
        console.log("got recipe: ",result);
        
        if(!result.product_list) { //ja product_list ir tukšš tad viņs pievieno atiecīgā veikala produktus
            const jsonData = {[tableName]:[productId]}
            //console.log(jsonData);

            await db.addProductToRecipe(jsonData, recipeId);
            
        }
        else {
            const productList = result.product_list;
            //console.log(result.product_list)
            if (productList[tableName]) {
                // If the key already exists, add the productId to the array (only if it doesn't already exist)
                if (!productList[tableName].includes(productId)) {
                    productList[tableName].push(productId);
                }
            } else {
                // If the key does not exist, add a new key and initialize with the productId
                productList[tableName] = [productId];
            }

            // Convert the updated product list back to a JSON string
            const updatedProductList = JSON.stringify(productList);

            // Update the recipe in the database
            await db.addProductToRecipe(updatedProductList, recipeId);
        }
        res.status(201).json({message:"product added" });


    } catch(err) {
        throw err;
    }
}

async function editRecipe(req, res) {

    try {
        const {recipeTitle, recipeContent, userId, recipeId, isPublic, deleteRecipe} = req.body;
        
        const result = await db.editRecipe(recipeTitle, recipeContent, recipeId, isPublic, deleteRecipe, userId);
        res.status(201).json({message:'recipe saved'});
    } catch (error) {
        throw error;
    }
}

async function insertRecipe(req, res) {

    try {
        const {recipeTitle, recipeContent, userId} = req.body;

        const result = await db.insertRecipe(recipeTitle, recipeContent, userId);
        res.status(201).json({message:'recipe saved'});

    } catch (error) {
        console.log('Error inserting recipe: ', error);
        res.error(500).json({error:'Failed to insert'});
    }
}

async function getRecipes(req, res) {
    try {
        const userId = req.params.userId;
        const recipes = await db.getRecipes(userId); // Fetch recipes
        

        // Iterate through each recipe
        for (const recipe of recipes) {
            if (recipe.product_list) {
                const updatedProductList = {}; // Store the updated product list with objects

                // Iterate over product_list entries
                for (const [tableName, productIds] of Object.entries(recipe.product_list)) {
                    // Fetch product objects using getProducts
                    const productObjects = await getProducts(tableName, productIds);

                    // Store the product objects in the updated list
                    updatedProductList[tableName] = productObjects;
                }

                // Replace product_list with updated product list containing product objects
                recipe.product_list = updatedProductList;
            }
        }

        // Send updated recipes back to the client
        
        res.json(recipes);
    } catch (error) {
        console.error("Error in getRecipes:", error);
        res.status(500).json({ error: "An error occurred while fetching recipes" });
    }
}

async function getProducts(tableName, productIds) {
    try {
        

        // Convert productIds to integers
        const intProductIds = productIds.map(id => parseInt(id, 10));

        // Fetch products using the query
        const result = await db.getProductsFromList(tableName, intProductIds);
        

        // Send result back to the client
        return result;
    } catch (err) {
        throw err;
    }
}



async function test(req, res) {    //just a test/debuging function
    const {username, password} = req.body;
    console.log(username, password, " testing 123");
    
}





module.exports = {
    loadHome,
    loadData,
    loadProdutsTable,
    registerUser,
    loginUser,
    insertRecipe,
    getRecipes,
    editRecipe,
    updateRecipeProductList,
    test
}