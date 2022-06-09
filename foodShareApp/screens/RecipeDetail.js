import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { db } from "../App";
import Moment from "moment";
import { Fab, Divider, Button } from "native-base";
import { Checkbox, Select } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { getDoc, doc } from "firebase/firestore";
import { SIZES, FONTS, COLORS } from "../constants";

const HEADER_HEIGHT = 350;

const RecipeDetail = ({ navigation, route }) => {
  const [recipeDetail, setRecipeDetail] = React.useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [ingredientsBoxes, setIngredientsBoxes] = React.useState([]);
  const [selectedTime, setSelectedTime] = React.useState("15:00");
  const [selectedPrice, setSelectedPrice] = React.useState(0);
  
  



  React.useEffect(() => {
    let { recipe, isFromHome } = route.params;
    if (isFromHome) {
      getData(recipe);
    } else {
      recipe.ingredients.sort((a, b) => b.amount - a.amount);
      var ingredientsCheckbox = [];
      recipe.ingredients.map((ing) => {
        if (ing.isOptional === false) {
          ingredientsCheckbox.push(ing.ingredientId);
        }
      })
      setIngredientsBoxes(ingredientsCheckbox);
      setRecipeDetail(recipe);
    }
  }, []);



  async function getData(recipe) {
    const recipeDetail = await getDoc(doc(db, "recipes", recipe.recipeId));
    recipeDetail.data().ingredients.sort((a, b) =>  a.amount - b.amount);
    var recipe = recipeDetail.data();
    recipe.ingredients.sort((a, b) =>  b.amount - a.amount);
    var ingredientsCheckbox = [];
    recipe.ingredients.map((ing) => {
      if (ing.isOptional === false) {
          ingredientsCheckbox.push(ing.ingredientId);
        }
      })
      setIngredientsBoxes(ingredientsCheckbox);
      setRecipeDetail(recipe);
  }



  function renderNavigationHeader() {
    return (
      <View
      style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 50,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingHorizontal: 0,
          paddingBottom: 10,
      }}
  >

      {/* Back button */}
      <TouchableOpacity
          style={{
              alignItems: 'center',
              justifyContent: 'center'
          }}
          onPress={() => navigation.goBack()}
      >
          <Text style={{
              color: COLORS.black ,
              ...FONTS.body3}}> <AntDesign name="left" size={18} color="black"/>zurück</Text>
      </TouchableOpacity>
  </View >
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
    var ingredients = recipeDetail.ingredients.map((ing) => {
        if (values.includes(ing.ingredientId)) {
            ing.isOptional = false;
        } else {
            ing.isOptional = true;
        }
        return ing;
    })  
    const newRec = {
      ...recipeDetail,
      ingredients
    }
    setRecipeDetail(newRec);
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
            ...FONTS.h2,
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

  function setTransformTime(itemValue) {
    console.log(itemValue);
  }

  function renderTimeSelection() {
    var items = [];
    new Array(24).fill().forEach((acc, index) => {
      items.push(Moment( {hour: index} ).format('HH:mm'));
      items.push(Moment({ hour: index, minute: 30 }).format('HH:mm'));
    });
    console.log(items);
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
            Abholbereit um:
          </Text>
          <Select selectedValue={selectedTime} width="115" bottom={2}  placeholder="Währe Uhrzeit aus" mt={1} _selectedItem={{bg: "purple.300"}} onValueChange={itemValue => setTransformTime(itemValue)}>
          {items.map((time, index) => (
              <Select.Item key={index} label={time} value={time} />
              ))}
        </Select>
        </View>
      </View>
    );
  }

  function renderPriceSelection() {
    var items = [];
    new Array(6).fill().forEach((acc, index) => {
      items.push(index);
      items.push(index + 0.5);
    });
    console.log(items);
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
            Anbieten für:
          </Text>
          <Select selectedValue={selectedPrice} width="115" bottom={2} placeholder="Währe den Preis" mt={1} _selectedItem={{bg: "purple.300"}} onValueChange={itemValue => setSelectedPrice(itemValue)}>
          {items.map((price, index) => (
              <Select.Item key={index} label={new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(price)} value={price} />
              ))}
        </Select>
        </View>
      </View>
    );
  }
  
  function renderPickUpLocation() {
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
            Abholstandort:
          </Text>
          <Button size="md" variant="link" colorScheme="purple" bottom={3}>
            <Text style={{
              flex: 1,
              color: COLORS.darkLime,
              ...FONTS.body4,
            }}>Heimadresse <AntDesign name="right" size={15} color={COLORS.darkLime}/></Text>
          </Button>
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
          {renderRecipeHeader()}
          {renderNavigationHeader()}
          {renderIngredientsSelection()}
          <Divider style={{width:350, alignSelf:"center"}}  my={2} />
          {renderNutrients()}
          <Divider style={{width:350, alignSelf:"center"}}  my={2} />
          {renderTimeSelection()}
          {renderPriceSelection()}
          {renderPickUpLocation()}
          <View style={{ paddingBottom: 100 }}></View>
          <Fab
            onPress={offerRecipe}
            backgroundColor={COLORS.transparentBlack9}
            renderInPortal={false}
            shadow={2}
            right={110}
            size="sm"
            icon={<Ionicons name="fast-food" size={24} color="white" />}
            label={<Text style={{ color: COLORS.white, ...FONTS.body4 }} fontSize="sm">Zu Abholung anbieten</Text>}
          />
        </View>
      )}

      {/* Header Bar */}
    </View>
  );
};

export default RecipeDetail;
