// Query with JavaScript using the Firebase Admin SDK
// See examples at https://firefoo.app/go/firestore-js-query
async function run() {
  let recipes = [];
  let ingredientsMap = {};
  let recipes_raw_with_ing = [];
  await db.collection("recipes").limit(50).get().then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data()
      })
    });
  });
  await db.collection("ingredients").get().then((data) => {
    data.forEach((doc) => {
      ingredientsMap[doc.id] = doc.data();
    }
    );
  });
  for (const rec of recipes) {
    rec.ingredients.forEach((ing) => {
      ing["kcal"] = Math.round((ingredientsMap[ing.ingredientId].kcal / 100) * ing.amount * ingredientsMap[ing.ingredientId].changingFactor),
      ing["fat"] = Math.round((ingredientsMap[ing.ingredientId].fat / 100) * ing.amount * ingredientsMap[ing.ingredientId].changingFactor),
      ing["protein"] = Math.round((ingredientsMap[ing.ingredientId].protein / 100) * ing.amount * ingredientsMap[ing.ingredientId].changingFactor),
      ing["carbs"] = Math.round((ingredientsMap[ing.ingredientId].carbs / 100) * ing.amount * ingredientsMap[ing.ingredientId].changingFactor)
    });
    console.log(rec);
    var recRef = await db.collection("recipes").doc(rec.id).set({ingredients: rec.ingredients}, { merge: true }).then(() => console.log("succ"));
  }
}