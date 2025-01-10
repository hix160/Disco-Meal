const {Router} = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();


indexRouter.get("/load/:tableId", indexController.loadData);
indexRouter.get("/load/:tableName/:categorieId", indexController.loadProdutsTable);

indexRouter.get("/test/backend", indexController.test);
indexRouter.get("/test/db", indexController.testDb);

indexRouter.post("/sign-up", indexController.registerUser);
indexRouter.post("/sign-in", indexController.loginUser);

indexRouter.post('/recipe', indexController.insertRecipe);
indexRouter.post('/recipe/edit', indexController.editRecipe);
indexRouter.post('/recipe/add', indexController.updateRecipeProductList);


indexRouter.get('/recipe/:userId', indexController.getRecipes);

module.exports = indexRouter;