const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const pool = require("./pool");

const STATIC_DATA_DIR = path.join(__dirname, "static-data");
const MAXIMA_FOLDER = path.join(STATIC_DATA_DIR, "maxima");
const RIMI_FOLDER = path.join(STATIC_DATA_DIR, "rimi");
const MAXIMA_CATEGORIES_FILE = path.join(STATIC_DATA_DIR, "maxima_categories.csv");
const RIMI_CATEGORIES_FILE = path.join(STATIC_DATA_DIR, "rimi_categories.csv");


// Parse CSV
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                data.push(row);
            })
            .on("end", () => resolve(data))
            .on("error", (err) => reject(err));
    });
};

// Create categories table
const createCategoriesTable = async (tableName) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id SERIAL PRIMARY KEY,
                category_name VARCHAR(255) NOT NULL,
                category_id VARCHAR(50) NOT NULL UNIQUE
            );
        `);
        console.log(`Table ${tableName} is ready.`);
    } catch (err) {
        console.error(`Error creating table ${tableName}: ${err.message}`);
    }
};

// Insert categories
const insertCategories = async (filePath, tableName) => {
    await createCategoriesTable(tableName);

    const data = await parseCSV(filePath);

    for (const { category_name, category_id } of data) {
        try {
            await pool.query(
                `INSERT INTO ${tableName} (category_name, category_id) VALUES ($1, $2)`,
                [category_name, category_id]
            );
        } catch (err) {
            console.error(`Failed to insert category: ${category_name}. Error: ${err.message}`);
        }
    }
};

// Create products table for Rimi
const createRimiProductTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rimi_products (
                id SERIAL PRIMARY KEY,
                product_name VARCHAR(255) NOT NULL,
                original_price NUMERIC NOT NULL,
                discount_price NUMERIC NOT NULL,
                category_id VARCHAR(50) REFERENCES rimi_categories(category_id) ON DELETE CASCADE
            );
        `);
        console.log("Table 'rimi_products' is ready.");
    } catch (err) {
        console.error(`Error creating 'rimi_products' table: ${err.message}`);
    }
};

// Create products table for Maxima
const createMaximaProductTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS maxima_products (
                id SERIAL PRIMARY KEY,
                product_name VARCHAR(255) NOT NULL,
                original_price NUMERIC NOT NULL,
                discount_price NUMERIC NOT NULL,
                category_id VARCHAR(50) REFERENCES maxima_categories(category_id) ON DELETE CASCADE
            );
        `);
        console.log("Table 'maxima_products' is ready.");
    } catch (err) {
        console.error(`Error creating 'maxima_products' table: ${err.message}`);
    }
};

// Insert products into the correct table (based on category ID format)
const insertProducts = async (folderPath, categoriesTable, productsTable) => {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const categoryId = path.parse(file).name;

        // Parse product data from the CSV
        const products = await parseCSV(filePath);

        // Insert products into the corresponding table
        for (const { product_name, original_price, discount_price } of products) {
            try {
                await pool.query(
                    `INSERT INTO ${productsTable} (product_name, original_price, discount_price, category_id) VALUES ($1, $2, $3, $4)`,
                    [product_name, original_price, discount_price, categoryId]
                );
            } catch (err) {
                console.error(
                    `Failed to insert product: ${product_name} in category ${categoryId}. Error: ${err.message}`
                );
            }
        }
    }
};

// Load static data
const loadStaticData = async () => {
    try {
        console.log("Inserting Rimi categories...");
        await insertCategories(RIMI_CATEGORIES_FILE, "rimi_categories");

        // Create Rimi product table
        await createRimiProductTable();

        console.log("Inserting Rimi products...");
        await insertProducts(RIMI_FOLDER, "rimi_categories", "rimi_products");

        console.log("Inserting Maxima categories...");
        await insertCategories(MAXIMA_CATEGORIES_FILE, "maxima_categories");

        // Create Maxima product table
        await createMaximaProductTable();

        console.log("Inserting Maxima products...");
        await insertProducts(MAXIMA_FOLDER, "maxima_categories", "maxima_products");

        console.log("Data loading complete!");
    } catch (err) {
        console.error("Error loading static data:", err.message);
    } finally {
        pool.end();
    }
};

loadStaticData();
