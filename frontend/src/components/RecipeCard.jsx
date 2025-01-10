import DeleteImg from '../assets/icons/delete_24dp.png';
import EditImg from '../assets/icons/edit_24dp.png';
import AddImg from '../assets/icons/shopping_cart_24dp.png';
import shareRecipe from '../assets/icons/present_to_all_24dp.png';

function RecipeCard({ data, handleCard }) {
  // Helper function to calculate totals
  const calculateTotals = (productList) => {

    if(!productList) return { totalPrice: '0', totalDiscount: '0', savings: '0' };

    let totalPrice = 0;
    let totalDiscount = 0;

    for (const productArray of Object.values(productList)) {
      productArray.forEach((product) => {
        totalPrice += parseFloat(product.original_price); // Sum up original prices
        totalDiscount += parseFloat(product.discount_price); // Sum up discount prices
      });
    }

    const savings = totalPrice - totalDiscount; // Calculate total savings
    return { totalPrice: totalPrice.toFixed(2), totalDiscount: totalDiscount.toFixed(2), savings: savings.toFixed(2) };
  };

  return (
    <div className="card-container">
      {data && data.length > 0 ? (
        data.map((row, index) => {
          // Calculate totals for each recipe
          const { totalPrice, totalDiscount, savings } = calculateTotals(row.product_list);

          return (
            <div key={index} className="card" onClick={() => handleCard(index)}>
              <div className="info">
                <div className="title">{row.recipe_title}</div>
                <div>Cena: {totalPrice}€</div>
                <div>Ar akcijām: {totalDiscount}€</div>
                <div id="discount-sum">Ietaupījums: {savings}€</div>
              </div>

              <div className="icon-container">
                <button>
                  <img src={AddImg} alt="Add to Cart" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default RecipeCard;
