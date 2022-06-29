import React, { useState, useEffect, useContext } from "react";
import { collection, getDoc, getDocs, query, addDoc, setDoc } from "firebase/firestore";
import { db } from "../App";
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { FONTS, COLORS, icons, images, SIZES, dummyData } from "../constants";
import { async } from "@firebase/util";
import { DoubleDropdown } from "../components";

const AddRecipe = ({ navigation, route }) => {
  const [recipeName, setRecipeName] = useState(null);  
  const [ingredients, setIngredients] = useState([]);
  const [user, setUser] = React.useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingDropdowns,  setIngDropdowns] = useState([]);


  React.useEffect(() => {
    let { user } = route.params;
    setUser(user);
    getData();
  }, []);

  async function getData() {
    console.log("get data add recipe")
    const ingredients = [];
    const measures = [];
    const ingQuery = query(collection(db, "ingredients"));
    const ingRef = await getDocs(ingQuery);
    ingRef.forEach((doc) => {
        ingredients.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    const measQuery = query(collection(db, "measures"));
    const measRef = await getDocs(measQuery);
    measRef.forEach((doc) => {
        measures.push({
        ...doc.data(),
      });
    });
    ingredients.forEach((i) => {
        var measure = measures.find(m => m.id == i.id);
        if (measure) {
            i['units'] = {...measure.units, Gramm:1};
        } else {
            i['units'] = {Gramm: 1}
        }

    })
    setIngredients(ingredients);
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

  async function saveRecipe() {

    const newRecipeRef = doc(collection(db, "recipes"));
    const savingRecipe = {
        ingredients: selectedIngredients,
        name: recipeName,
        numOfRecipesInc: null,
        recipeId: newRecipeRef.id,
        rowType: 'custom'
    }

    await setDoc(newRecipeRef, savingRecipe);
    navigation.goBack();
    console.log(savingRecipe);

  }

  function addNewDropdown() {
    setIngDropdowns(ingDropdowns.concat(<DoubleDropdown key={ingDropdowns.length} data={ingredients} selectedIngredients={selectedIngredients}></DoubleDropdown>))
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
      <View>
        <ScrollView
          style={{ padding: SIZES.padding }}
          contentContainerStyle={{ justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", justifyContent: "center", marginBottom: SIZES.padding }}>
            <Text style={{ color: COLORS.black, ...FONTS.h2 }}>Gericht hinzufügen</Text>
          </View>
          <TextInput
            style={{
              borderColor: COLORS.gray,
              borderRadius: "5px",
              borderWidth: "2px",
              color: COLORS.black,
              ...FONTS.body3,
              marginBottom: SIZES.margin,
              marginTop: SIZES.margin,
              paddingHorizontal: SIZES.margin,
              paddingVertical: SIZES.margin,
            }}
            placeholder="Name des Gerichts"
            placeholderTextColor={COLORS.gray}
            autoCorrect={false}
            onChangeText={text => setRecipeName(text)}
          />
          <View style={{ justifyContent: "center", marginBottom: SIZES.padding }}>
          </View>
          {
           ingDropdowns
          }
          <View
            style={{ flexDirection: "row", justifyContent: "center", marginBottom: SIZES.margin, width: "100%" }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.darkLime,
                borderRadius: "30px",
                flexDirection: "row",
                paddingHorizontal: SIZES.padding,
                paddingVertical: "10px",
              }}
              onPress={addNewDropdown}
            >
              <Ionicons name="add-circle" size={24} style={{ color: COLORS.white, marginRight: SIZES.margin }} />
              <Text style={{ color: COLORS.white, ...FONTS.body4 }}>Zutat hinzufügen</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "center", marginBottom: SIZES.margin, width: "100%" }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.darkLime,
                borderRadius: "30px",
                flexDirection: "row",
                paddingHorizontal: SIZES.padding,
                paddingVertical: "10px",
              }}
              onPress={saveRecipe}
            >
              <Ionicons name="add-circle" size={24} style={{ color: COLORS.white, marginRight: SIZES.margin }} />
              <Text style={{ color: COLORS.white, ...FONTS.body4 }}>Gericht hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {renderNavigationHeader()}
      </View>
    </SafeAreaView>
  );
};

export default AddRecipe;
