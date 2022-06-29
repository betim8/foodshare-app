import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Animated, Platform, ActivityIndicator, StyleSheet } from "react-native";
import { db } from "../App";
import Moment from "moment";
import { Fab } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { CustomButton } from "../components";


import { getDoc, doc, setDoc } from "firebase/firestore";
import { BlurView } from "expo-blur";
import { SIZES, FONTS, icons, COLORS } from "../constants";
import { Rating } from 'react-native-ratings';


const HEADER_HEIGHT = 350;

const RecipeCreatorCardDetail = ({ selectedOrder }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          marginLeft: 20,
        }}
      >
        <Image
          source={selectedOrder?.fromUserAvatar}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
      </View>

      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <Text style={{ color: COLORS.white2, ...FONTS.body4 }}>Menü von:</Text>
        <Text style={{ color: COLORS.white2, ...FONTS.h3 }}>{selectedOrder?.fromUserName}</Text>
      </View>

      <TouchableOpacity
        onPress={() => console.log("View Profile")}
        style={{
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 20,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: COLORS.white2,
        }}
      >
        <Image
          source={icons.rightArrow}
          style={{
            width: 15,
            height: 15,
            tintColor: COLORS.white2,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const RecipeCreatorCardInfo = ({ selectedOrder }) => {
  if (Platform.OS === "ios") {
    return (
      <BlurView
        style={{
          flex: 1,
        }}
        blurType="dark"
      >
        <RecipeCreatorCardDetail selectedOrder={selectedOrder} />
      </BlurView>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.transparentBlack5,
        }}
      >
        <RecipeCreatorCardDetail selectedOrder={selectedOrder} />
      </View>
    );
  }
};

const ConfirmedOrder = ({ navigation, route }) => {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [recipeDetail, setRecipeDetail] = React.useState(null);
  const [rating, setRating] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [requested, setRequested] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    console.log(route.params);
    let { recipe } = route.params;
    console.log(recipe);
    const date = new Date(recipe.pickUpTime.seconds * 1000);
    recipe["pickupInH"] = Moment(date).format("HH:mm");
    getData(recipe);
    setSelectedOrder(recipe);
  }, []);

  async function getData(recipe) {
    const recipeDetail = await getDoc(doc(db, "recipes", recipe.recipeId));
    recipeDetail.data().ingredients.sort((a, b) => a.amount - b.amount);
    var sorted = recipeDetail.data();
    sorted.ingredients.sort((a, b) => b.amount - a.amount);
    setRecipeDetail(sorted);
    setIsLoading(false);
  }

  function renderHeaderBar() {
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

  function renderRecipeCardHeader() {
    return (
      <View
        style={{
          marginTop: -1000, // To make sure header image doesn't scroll
          paddingTop: 1000, // To make sure header image doesn't scroll
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Animated.Image
          source={selectedOrder?.recipeImgSrc}
          resizeMode="contain"
          style={{
            height: HEADER_HEIGHT,
            width: "200%",
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                  outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
                }),
              },
              {
                scale: scrollY.interpolate({
                  inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                  outputRange: [2, 1, 0.75],
                }),
              },
            ],
          }}
        />

        {/* Recipe creator card */}
        <Animated.View
          style={{
            height: 80,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 170, 250],
                  outputRange: [0, 0, 100],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <RecipeCreatorCardInfo selectedOrder={selectedOrder} />
        </Animated.View>
      </View>
    );
  }

  function renderRecipeInfo() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 130,
          width: SIZES.width,
          paddingHorizontal: 30,
          paddingVertical: 20,
          alignItems: "center",
        }}
      >
        {/* Recipe Name */}
        <View
          style={{
            flex: 4,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: COLORS.black, ...FONTS.h2 }}>{selectedOrder?.recipeName}</Text>
          <Text
            style={{
              marginTop: 5,
              color: COLORS.darkLime,
              ...FONTS.body3,
            }}
          >
            Abholbereit um: {selectedOrder?.pickupInH}
          </Text>
        </View>
        <View
          style={{
            flex: 1.5,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              marginTop: 5,
              color: COLORS.darkLime,
              ...FONTS.body2,
            }}
          >
            {new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" }).format(selectedOrder?.cost)}
          </Text>
        </View>
      </View>
    );
  }

  function renderIngredientHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 30,
          marginTop: SIZES.radius,
          marginBottom: SIZES.padding - 20,
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
        <Text
          style={{
            color: COLORS.lightGray2,
            ...FONTS.body4,
          }}
        >
          {recipeDetail?.ingredients.length} Zutaten
        </Text>
      </View>
    );
  }

  function renderIngredients() {
    return (
      <Text
        style={{
          color: COLORS.black,
          paddingHorizontal: 30,
          ...FONTS.body4,
        }}
      >
        {recipeDetail?.ingredients.map((ing) => {
          return ing.name + ", ";
        })}
      </Text>
    );
  }

  function renderNutrients() {
    let totalMealNutr = {
      carbs: 0,
      proteins: 0,
      fat: 0,
      kcal: 0,
    };
    recipeDetail.ingredients.forEach((ing) => {
      totalMealNutr.carbs += isNaN(ing.carbs) ? 0 : ing.carbs;
      totalMealNutr.kcal += isNaN(ing.kcal) ? 0 : ing.kcal;
      totalMealNutr.proteins += isNaN(ing.protein) ? 0 : ing.protein;
      totalMealNutr.fat += isNaN(ing.fat) ? 0 : ing.fat;
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

  async function confirmRating() {
    const userRef = await getDoc(doc(db, "users", selectedOrder.fromUserUid));
    
    const userToBeRated = {id: userRef.id, ...userRef.data()};
    console.log(rating);
    console.log(userToBeRated);
    let numOfReviews = userToBeRated.numOfReviews + 1;
    let totalReviewRating = userToBeRated.totalReviewRating + rating;
    await setDoc(doc(db, 'users', userRef.id), { numOfReviews: numOfReviews, totalReviewRating:totalReviewRating },{ merge: true });
    setModalVisible(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    flex: 1,
                    ...FONTS.h2,
                    marginHorizontal: SIZES.padding - 20,
                  }}
                >
                  Bewerte die Mahlzeit von {selectedOrder.fromUserName}
                </Text>
                <Rating
                    ratingColor='#3498db'
                    imageSize={25}
                    readonly={false}
                    startingValue={0}
                    onFinishRating={rating => setRating(rating)}

                />
                <CustomButton
                  buttonText="Bestätigen"
                  buttonContainerStyle={{
                    paddingVertical: 5,
                    marginVertical: 10,
                    borderRadius: 20,
                    width: 80,
                  }}
                  colors={[COLORS.darkGreen, COLORS.darkGreen]}
                  onPress={confirmRating}
                  textColor={COLORS.white}
                  fontStyle={FONTS.body3}
                />
                <CustomButton
                  buttonText="Schliessen"
                  buttonContainerStyle={{
                    paddingVertical: 5,
                    marginVertical: 1,
                    borderRadius: 20,
                    width: 80,
                  }}
                  colors={[COLORS.lightGray, COLORS.lightGray]}
                  onPress={() => setModalVisible(false)}
                  textColor={COLORS.black}
                  fontStyle={FONTS.body3}
                />
              </View>
            </View>
          </Modal>
          {renderRecipeCardHeader()}
          {renderRecipeInfo()}
          {renderIngredientHeader()}
          {renderIngredients()}
          {renderHeaderBar()}
          {renderNutrients()}
          <View style={{ paddingBottom: 100 }}></View>
          <Fab
            onPress={() => selectedOrder.status === "done" ? setModalVisible(true) : null}
            backgroundColor={selectedOrder.status === "done" ? COLORS.transparentBlack9 : COLORS.transparentBlack5}
            renderInPortal={false}
            shadow={2}
            right={selectedOrder.status === "done" ? 148 : 110}
            size="sm"
            icon={<Ionicons name="fast-food" size={24} color="white" />}
            label={
              selectedOrder.status === "done" ? (
                <Text style={{ color: COLORS.white, ...FONTS.body4 }} fontSize="sm">
                  Bewerten
                </Text>
              ) : (
                <Text style={{ color: COLORS.white, ...FONTS.body4 }} fontSize="sm">
                  Abholung im Gange...
                </Text>
              )
            }
          />
        </View>
      )}

      {/* Header Bar */}
    </View>
  );
};
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
  });
export default ConfirmedOrder;
