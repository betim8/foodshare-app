import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { db } from "../App";
import Moment from "moment";
import { Fab } from "native-base";
import { Checkbox } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { getDoc, doc } from "firebase/firestore";
import { SIZES, FONTS, COLORS } from "../constants";

const HEADER_HEIGHT = 350;

const RecipeDetail = ({ navigation, route }) => {
  const [recipeDetail, setRecipeDetail] = React.useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [ingredientsBoxes, setIngredientsBoxes] = React.useState([]);

  React.useEffect(() => {
    let { recipe } = route.params;
    console.log(recipe);
    recipe.ingredients.sort((a, b) => b.amount - a.amount);
    var ingredientsCheckbox = [];
    recipe.ingredients.map((ing) => {
      if (ing.isOptional === false) {
        ingredientsCheckbox.push(ing.ingredientId);
      }
    })
    setIngredientsBoxes(ingredientsCheckbox);
    setRecipeDetail(recipe);
    //getData(recipe);
  }, []);

  async function getData(recipe) {
    const recipeDetail = await getDoc(doc(db, "recipes", recipe.recipeId));
    var sorted = recipeDetail.data();
    sorted.ingredients.sort((a, b) => b.amount - a.amount);
    sorted.map((ing) => {
        if (ing.isOptional === false) {
          ingredientsCheckbox.push(ing.ingredientId);
        } 
    })
    setIngredientsBoxes(ingredientsCheckbox);
    setRecipeDetail(sorted);
  }

  function renderNavigationHeader() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 50,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingHorizontal: 0,
          paddingBottom: 10,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.body3,
            }}
          >
            {" "}
            <AntDesign name="left" size={18} color="black" />
            zurück
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderRecipeHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 130,
          width: SIZES.width,
          paddingHorizontal: 30,
          paddingTop: 85,
          paddingBottom: 10,
          alignItems: "center",
        }}
      >
        {/* Recipe Name */}
        <View
          style={{
            flex: 1.5,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: COLORS.black, ...FONTS.h2 }}>{recipeDetail?.name}</Text>
        </View>
      </View>
    );
  }

  function setSelectedIngs(values) {
    console.log(values);
    recipeDetail.ingredients.map((ing) => {
        if (values.includes(ing.ingredientId)) {
            ing.isOptional = false;
        } else {
            ing.isOptional = true;
        }
    })
    setRecipeDetail(recipeDetail);
  }

  function renderIngredientsSelection() {
    return (
      <View
        style={{
          flexDirection: "column",
          paddingVertical: 0,
          justifyContent: "center",
          marginTop: SIZES.radius,
          marginBottom: SIZES.padding - 20,
          paddingHorizontal: 30
        }}
      >
        <Text
          style={{
            flex: 1,
            ...FONTS.h3,
          }}
        >
          Zutaten
        </Text>
        <Checkbox.Group
          colorScheme="violet"
          defaultValue={ingredientsBoxes}
          accessibilityLabel="pick an item"
          onChange={(values) => {
            setSelectedIngs(values || []);
          }}
        >
            {
                recipeDetail.ingredients.map((ing, index) => (
                    <Checkbox key={index} value={ing.ingredientId} my="3">
                        {ing.name}  
                    </Checkbox>
                ))
            }
        </Checkbox.Group>
      </View>
    );
  }

  function renderNutrients() {
    let totalMealNutr = {
      carbs: 0,
      proteins: 0,
      fat: 0,
      kcal: 0,
    };
    recipeDetail?.ingredients.forEach((ing) => {
        if (ing.isOptional === false) {
      totalMealNutr.carbs += isNaN(ing.carbs) ? 0 : ing.carbs;
      totalMealNutr.kcal += isNaN(ing.kcal) ? 0 : ing.kcal;
      totalMealNutr.proteins += isNaN(ing.protein) ? 0 : ing.protein;
      totalMealNutr.fat += isNaN(ing.fat) ? 0 : ing.fat;
        }
    });
    return (
      <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 30,
          marginTop: SIZES.padding,
          marginBottom: SIZES.padding - 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              color: COLORS.black,
              ...FONTS.h3,
            }}
          >
            Nährwerte pro 100g
          </Text>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.h3,
            }}
          >
            {totalMealNutr.kcal} kcal
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              color: COLORS.black,
              ...FONTS.body4,
            }}
          >
            Eiweiss
          </Text>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.body4,
            }}
          >
            {totalMealNutr.proteins}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              color: COLORS.black,
              ...FONTS.body4,
            }}
          >
            Kohlenhydrate
          </Text>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.body4,
            }}
          >
            {totalMealNutr.carbs}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              color: COLORS.black,
              ...FONTS.body4,
            }}
          >
            Fett
          </Text>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.body4,
            }}
          >
            {totalMealNutr.fat}
          </Text>
        </View>
      </View>
    );
  }

  async function offerRecipe() {
    console.log("letsgo");

    var updatedOrder = {
      ...selectedOrder,
      //TODO Replace with Auth getUser
    };
    console.log(updatedOrder);
    //await setDoc(doc(db, 'orders', updatedOrder.id), { status: updatedOrder.status, toUserUid: updatedOrder.toUserUid }, { merge: true });
    setSelectedOrder(updatedOrder);
    console.log(selectedOrder);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      { !recipeDetail ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <View>
          {renderNavigationHeader()}
          {renderRecipeHeader()}
          {renderIngredientsSelection()}
          {renderNutrients()}
          <View style={{ paddingBottom: 100 }}></View>
          <Fab
            onPress={offerRecipe}
            backgroundColor={COLORS.transparentBlack9}
            renderInPortal={false}
            shadow={2}
            right={140}
            size="sm"
            icon={<Ionicons name="fast-food" size={24} color="white" />}
            label={<Text style={{ color: COLORS.white, ...FONTS.body4 }} fontSize="sm">Bereitstellen</Text>}
          />
        </View>
      )}

      {/* Header Bar */}
    </View>
  );
};

export default RecipeDetail;
