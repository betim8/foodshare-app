// Query with JavaScript using the Firebase Admin SDK
// See examples at https://firefoo.app/go/firestore-js-query
async function run() {
  let masterRecipes = [];
  let recipesAligned = [];
  const query = await db.collection("recipes_raw")
    .limit(50)
    .get().then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ingredients: doc.data().ingredients,
      rowType: doc.data().rowType,
      name: doc.data().name,
      recipeId: doc.data().recipeId
          }));
    data.forEach(recipe => {
      let sum = 0;
      recipe.ingredients.forEach(ing => { sum += ing.amount})
      let factor = 100/sum;
      recipe.ingredients.forEach(ing => { ing.amount = factor*ing.amount})
      recipesAligned.push(recipe);
      //console.log(recipesAligned)
      //console.log(recipe);
    }); 
    let groupedRecipes = groupBy(recipesAligned, 'recipeId');
    for (var recipe in groupedRecipes) {
      let masterRecipe = {
        recipeId: groupedRecipes[recipe][0].recipeId,
        ingredients: [],
        rowType: "master",
        name: groupedRecipes[recipe][0].name,
        numOfRecipesInc: groupedRecipes[recipe].length
      }
      const ingredientMap = {};
      groupedRecipes[recipe].forEach(rr => {
        //console.log(rr);
        rr.ingredients.forEach (ingg => {
          //console.log(ingg);
          let ingredient = ingredientMap[ingg.ingredientId];
          if (ingredient == null || ingredient == undefined) {
            ingredientMap[ingg.ingredientId] = [ingg];
          } else {
            ingredient.push(ingg);
            ingredientMap[ingg.ingredientId] = ingredient;
          }
        });
      });
      
      for (var ingr in ingredientMap) {
        let sumAmount = 0;
        let numOfSameIng = ingredientMap[ingr].length;
        ingredientMap[ingr].forEach (iii => {
          sumAmount += iii.amount;
        });
        let average = Math.round(sumAmount/numOfSameIng * 10) / 10;
        masterRecipe.ingredients.push({
          name: ingredientMap[ingr][0].name,
          amount: average,
          recipeCount: numOfSameIng,
          isOptional: false,
          ingredientType: "",
          ingredientId: ingredientMap[ingr][0].ingredientId
        })
      } 
      masterRecipes.push(masterRecipe);
    }    
    
  });
  for (const mr of masterRecipes) {
    await db.collection("recipes").doc(mr.recipeId).set(mr);
  }  
  return groupBy(recipesAligned, 'recipeId');
  //return query;
}
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
