import React, { useEffect } from "react";
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../App";
import { View, Text, SafeAreaView, FlatList, ActivityIndicator } from "react-native";
import { OrderCard } from "../components";
import { FONTS, COLORS, SIZES } from "../constants";
import { CustomButton } from "../components";
import { Fab } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import RequestCard from "../components/RequestCard";

const OrderOverview = ({ navigation }) => {
  const [orders, setOrders] = React.useState([]);
  const [consumerMode, setConsumerMode] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [requests, setRequests] = React.useState([]);




  useEffect(() => {
    console.log("useffect userdata")
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserData(user.uid);
      } 
  });

  }, []);

  useEffect(() => {
    console.log("useffect order data")

      if (consumerMode) {
        getOrderData(user?.id);
      } else {
        getRequests(user?.id);
      }
  }, [user, consumerMode]);



  async function getUserData(userUid) {
    console.log("useradata")
    const userRef = await getDoc(doc(db, "users", userUid));
    setUser({
      id: userRef.id,
      ...userRef.data()
    });
    // if (userUid !== user?.id) {
    //   let user = {id: userRef.id, ...userRef.data()}
    //   setReqUsers([...reqUsers, user]);
    // } 
  }

  async function getOrderData(userUid) {
    let orderData = [];
    if (userUid) {
      const orderQuery = query(collection(db, "orders"), where("toUserUid", "==", userUid));
      const orderHistQuery = query(collection(db, "orders_hist"), where("toUserUid", "==", userUid));
    const orderRef = await getDocs(orderQuery);
    const orderHistRef = await getDocs(orderHistQuery);
    orderRef.forEach((doc) => {
      orderData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    orderHistRef.forEach((doc) => {
      orderData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setOrders(orderData);
    }
    
  }

  async function getRequests(userUid) {
    let orderData = [];

    let requests = [];
    const orderQuery = query(collection(db, "orders"), where("fromUserUid", "==", userUid));
    const orderRef = await getDocs(orderQuery);
    orderRef.forEach((doc) => {
      orderData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    for (let o of orderData) {
      let order = {};
      order.recipeName = o.recipeName;
      let users = [];
      for (let userId of o.requestingUserIds) {
        console.log(userId);
        const userRef = await getDoc(doc(db, "users", userId));
        users.push({id: userRef.id, ...userRef.data()});
      }
      order.users = users;
      requests.push(order);
    }
    console.log(requests);
    setRequests(requests);
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
          buttonText="Bestellungen"
          buttonContainerStyle={{
            paddingVertical: 2.5,
            borderRadius: 20,
            width: 100,
          }}
          colors={consumerMode ? activeSwitchStyle.colors : inactiveSwitchStyle.colors}
          onPress={toggleSwitch}
          textColor={consumerMode ? activeSwitchStyle.textColor : inactiveSwitchStyle.textColor}
          fontStyle={FONTS.body3}
        />
        <CustomButton
          buttonText="Anfragen"
          buttonContainerStyle={{
            paddingVertical: 2.5,
            borderRadius: 20,
            width: 100,
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
            Bestellungen
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
            Anfragen
          </Text>
          <Text
            style={{
              marginTop: 3,
              color: COLORS.gray,
              ...FONTS.body3,
            }}
          >
            Leute haben dein Gericht angefragt
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
        <Text style={{ flex: 1, ...FONTS.h3 }}>Bestellungen</Text>
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
        <Text style={{ flex: 1, ...FONTS.h2 }}>Aktive Anfragen</Text>
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
        data={consumerMode ? orders : requests}
        keyExtractor={(item) => `${item.id}`}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {renderSwitch()}
            {consumerMode ? renderMainHeaderConsumer() : renderMainHeaderCook()}
            {/* {consumerMode ? renderSubHeaderConsumer() : renderSubHeaderCook()} */}
          </View>
        }
        renderItem={({ item }) => {
          return (
            consumerMode ? (
            <OrderCard
              containerStyle={{
                marginHorizontal: SIZES.padding,
              }}
              categoryItem={item}
              onPress={() => navigation.navigate(consumerMode ? "OrderDetail" : "RecipeDetail", { recipe: item, isFromHome: true })}
              isConsumerMode={consumerMode}
            />) : (
              <RequestCard
              containerStyle={{
                marginHorizontal: SIZES.padding,
              }}
              request={item}
              onPress={() => navigation.navigate(consumerMode ? "OrderDetail" : "RecipeDetail", { recipe: item, isFromHome: true })}
              isConsumerMode={consumerMode}
            />
            )
          );
        }}
        ListFooterComponent={
        <View style={{ marginBottom: 100 }}></View> }
      />
    </SafeAreaView>
  );
};
export default OrderOverview;
