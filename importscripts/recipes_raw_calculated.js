// Query with JavaScript using the Firebase Admin SDK
// See examples at https://firefoo.app/go/firestore-js-query
async function run() {
  let recipes_raw_data = [];
  let ingredientsMap = {};
  let recipes_raw_with_ing = [];
  await db.collection("recipes_raw").limit(50).get().then((snapshot) => {
    recipes_raw_data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ingredients: doc.data().ingredients,
      rowType: doc.data().rowType,
      name: doc.data().name,
      recipeId: doc.data().recipeId
    }));
  });
  await db.collection("ingredients").get().then((data) => {
    data.forEach((doc) => {
      ingredientsMap[doc.id] = doc.data();
    }
    );
  });
  recipes_raw_data.forEach(rec => {
    let sum = 0;
    rec.ingredients.forEach(ing => {
      sum += ing.amount /// ingredientsMap[ing.ingredientId].changingFactor;
    });
    rec["totalAmount"] = Math.round(sum);
    rec.ingredients.forEach(iing => {
      let ingredientDetail = ingredientsMap[iing.ingredientId];
      //iing["kcal"] = (sum * iing.amount * ingredientDetail.kcal * ingredientDetail.changingFactor) / 10000;
      iing["kcal"] = Math.round((iing.amount * ingredientDetail.kcal) / 100);
      iing["fat"] = Math.round((iing.amount * ingredientDetail.fat) / 100);
      iing["carbs"] = Math.round((iing.amount * ingredientDetail.carbs) / 100);
      iing["protein"] = Math.round((iing.amount * ingredientDetail.protein) / 100);
      iing["changingFactor"] = ingredientDetail.changingFactor;
    })
  });

   
  recipes_raw_data.forEach(rec => {
    let totalMealNutr = {
            carbs: 0,
            proteins: 0,
            fat: 0,
            kcal: 0
  };
    rec.ingredients.forEach(ing => {
      totalMealNutr.carbs += isNaN(ing.carbs) ?  0 : ing.carbs;
      totalMealNutr.kcal += isNaN(ing.kcal) ? 0 : ing.kcal;
      totalMealNutr.proteins += isNaN(ing.protein) ? 0 : ing.protein;
      totalMealNutr.fat += isNaN(ing.fat) ? 0 : ing.fat;
    })
    rec['carbs'] = totalMealNutr.carbs;
    rec['fat'] = totalMealNutr.fat;
    rec['proteins'] = totalMealNutr.proteins;
    rec['kcal'] = totalMealNutr.kcal;
    //delete rec.ingredients;
  })
  return recipes_raw_data;
  
}