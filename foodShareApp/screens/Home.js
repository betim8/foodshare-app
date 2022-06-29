import React, { useEffect } from "react";
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../App";
import { View, Text, SafeAreaView, FlatList, ActivityIndicator } from "react-native";
import { CategoryCard } from "../components";
import { FONTS, COLORS, SIZES } from "../constants";
import { CustomButton } from "../components";
import { Fab } from "native-base";
import { Ionicons } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  const [orders, setOrders] = React.useState(orderData);
  const [consumerMode, setConsumerMode] = React.useState(true);
  const [user, setUser] = React.useState(null);

  const orderData = [];


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        getUserData(user.uid);
      } 
  });
  }, []);

  useEffect(() => {
    if (user) {
      if (consumerMode) {
        getOrderData(user?.id);
      } else {
        getHistOrders(user?.id);
      }
    } 
  }, [consumerMode, user]);



  async function getUserData(userUid) {
    const userRef = await getDoc(doc(db, "users", userUid));
    setUser({
      id: userRef.id,
      ...userRef.data()
    });
  }

  async function getOrderData(userUid) {
    const orderQuery = query(collection(db, "orders"), where("status", "==", "active"), where("fromUserUid", "!=", userUid));
    const orderRef = await getDocs(orderQuery);
    orderRef.forEach((doc) => {
      orderData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setOrders(orderData);
  }

  async function getHistOrders(userUid) {
    const orderQuery = query(collection(db, "orders_hist"), where("fromUserUid", "==", userUid));
    const orderRef = await getDocs(orderQuery);
    orderRef.forEach((doc) => {
      orderData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setOrders(orderData);
  }

  var activeSwitchStyle = {
    colors: [COLORS.darkGreen, COLORS.darkGreen],
    textColor: COLORS.white,
  };

  var inactiveSwitchStyle = {
    colors: [COLORS.lightGray, COLORS.lightGray],
    textColor: COLORS.black,
  };

  function toggleSwitch() {
    setConsumerMode(!consumerMode);
  }

  function renderSwitch() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: SIZES.padding,
          alignItems: "center",
          justifyContent: "center",
          height: 80,
        }}
      >
        <CustomButton
          buttonText="Abholen"
          buttonContainerStyle={{
            paddingVertical: 2.5,
            borderRadius: 20,
            width: 80,
          }}
          colors={consumerMode ? activeSwitchStyle.colors : inactiveSwitchStyle.colors}
          onPress={toggleSwitch}
          textColor={consumerMode ? activeSwitchStyle.textColor : inactiveSwitchStyle.textColor}
          fontStyle={FONTS.body3}
        />
        <CustomButton
          buttonText="Anbieten"
          buttonContainerStyle={{
            paddingVertical: 2.5,
            borderRadius: 20,
            width: 80,
          }}
          colors={!consumerMode ? activeSwitchStyle.colors : inactiveSwitchStyle.colors}
          onPress={toggleSwitch}
          textColor={!consumerMode ? activeSwitchStyle.textColor : inactiveSwitchStyle.textColor}
          fontStyle={FONTS.body3}
        />
      </View>
    );
  }

  function renderMainHeaderConsumer() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: SIZES.padding,
          alignItems: "center",
          height: 80,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.h2,
            }}
          >
            Hallo {user.surName}
          </Text>
          <Text
            style={{
              marginTop: 3,
              color: COLORS.gray,
              ...FONTS.body3,
            }}
          >
            Schau dir Menüs in deiner Nähe an
          </Text>
        </View>
      </View>
    );
  }

  function renderMainHeaderCook() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: SIZES.padding,
          alignItems: "center",
          height: 80,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.h2,
            }}
          >
            Hallo {user.surName}
          </Text>
          <Text
            style={{
              marginTop: 3,
              color: COLORS.gray,
              ...FONTS.body3,
            }}
          >
            Was möchtest du heute anbieten?
          </Text>
        </View>
      </View>
    );
  }

  function renderSubHeaderConsumer() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginHorizontal: SIZES.padding,
        }}
      >
        <Text style={{ flex: 1, ...FONTS.h2 }}>Menüs in deiner Nähe</Text>
      </View>
    );
  }

  function renderSubHeaderCook() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginHorizontal: SIZES.padding,
        }}
      >
        <Text style={{ flex: 1, ...FONTS.h2 }}>Kürzlich gekochte Menüs</Text>
      </View>
    );
  }

  return !user || !orders ? (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={COLORS.darkGreen} />
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <FlatList
        data={consumerMode ? orders : orders}
        keyExtractor={(item) => `${item.id}`}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {renderSwitch()}
            {consumerMode ? renderMainHeaderConsumer() : renderMainHeaderCook()}
            {consumerMode ? renderSubHeaderConsumer() : renderSubHeaderCook()}
          </View>
        }
        renderItem={({ item }) => {
          return (
            <CategoryCard
              containerStyle={{
                marginHorizontal: SIZES.padding,
              }}
              categoryItem={item}
              onPress={() => navigation.navigate(consumerMode ? "OrderDetail" : "RecipeDetail", { recipe: item, isFromHome: true, user: user })}
              isConsumerMode={consumerMode}
            />
          );
        }}
        ListFooterComponent={consumerMode ? 
        <View style={{ marginBottom: 100 }}></View> 
        :
        <View>
            <View style={{ marginBottom: 100 }}></View> 
            <Fab onPress={() => navigation.navigate("Search")} backgroundColor={COLORS.transparentBlack9} renderInPortal={false} shadow={2} right={90} size="sm" icon={<Ionicons name="fast-food" size={24} color="white" />} label={<Text style={{ color: COLORS.white, ...FONTS.body4 }} fontSize="sm">Andere Gerichte freigeben</Text>} />
        </View>
        
        }
      />
    </SafeAreaView>
  );
};
export default Home;
