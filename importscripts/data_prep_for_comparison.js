// Query with JavaScript using the Firebase Admin SDK
// See examples at https://firefoo.app/go/firestore-js-query
async function run() {
  let recipes = [];
  await db.collection("recipes").limit(50).get().then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data()
      })
    });
  });
  for (const rec of recipes) {
    console.log("------------- next recipe: -----------" + rec.name)
    
    calcSum(rec.ingredients);
    displayIng(rec.ingredients);
    
  }
}

function displayIng(ingredients) {
  ingredients.forEach((ing) => {
    console.log(ing.name + "," + (isNaN(ing.protein) ? 0 : ing.protein) + "," + (isNaN(ing.carbs) ? 0 : ing.carbs) + "," + (isNaN(ing.fat) ? 0 : ing.fat) + "," + (isNaN(ing.kcal) ? 0 : ing.kcal) + "," + (ing.isOptional ? 0 : 1));
  })
}

function calcSum(ingredients) {

      let totalMealNutr = {
      carbs: 0,
      proteins: 0,
      fat: 0,
      kcal: 0
    };
    
    ingredients.forEach((ing) => {
      if (ing.isOptional === false) { 
      totalMealNutr.carbs += isNaN(ing.carbs) ? 0 : ing.carbs;
      totalMealNutr.kcal += isNaN(ing.kcal) ? 0 : ing.kcal;
      totalMealNutr.proteins += isNaN(ing.protein) ? 0 : ing.protein;
      totalMealNutr.fat += isNaN(ing.fat) ? 0 : ing.fat;
      }
    });
  console.log(totalMealNutr);
}