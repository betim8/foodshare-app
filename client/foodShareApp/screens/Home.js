import React, { useEffect } from 'react';
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore"; 
import { db } from '../App';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
} from "react-native";
import { CategoryCard } from "../components";
import { FONTS, COLORS, SIZES } from "../constants";
import { CustomButton } from "../components";

const Home = ( {navigation} ) => {

    const [menu, setMenu] = React.useState(menuData);
    const [consumerMode, setConsumerMode] = React.useState(true);
    const [user, setUser] = React.useState({});

    const menuData = [];

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const orderQuery = query(collection(db, "orders"), where("status", "==", "active"));
        const orderRef = await getDocs(orderQuery);
        const userRef = await getDoc(doc(db, "users", "zOnF8hSRz5YDzfk1vq2y5AeqVIh1"));
        userRef.exists() ? setUser(userRef.data()) : setUser({});
        orderRef.forEach((doc) => {   
            menuData.push({
                id: doc.id,
                ...doc.data()
            })
        });
        setMenu(menuData);
    };

    var activeSwitchStyle = {
        colors: [COLORS.darkGreen, COLORS.darkGreen],
        textColor: COLORS.white
    }

    var inactiveSwitchStyle = {
        colors: [COLORS.lightGray, COLORS.lightGray],
        textColor: COLORS.black
    }

    function toggleSwitch() {
        setConsumerMode(!consumerMode);
    }

    function renderSwitch() {
        return (
            <View style={{
                flexDirection: 'row',
                marginHorizontal: SIZES.padding,
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
            }}>
               <CustomButton
                        buttonText="Abholen"
                        buttonContainerStyle={{
                            paddingVertical: 2.5,
                            borderRadius: 20,
                            width: 80
                        }}
                        colors={consumerMode ? activeSwitchStyle.colors : inactiveSwitchStyle.colors}
                        onPress={toggleSwitch}
                        textColor={ consumerMode ? activeSwitchStyle.textColor : inactiveSwitchStyle.textColor}
                        fontStyle={FONTS.body3}
                    />
                    <CustomButton
                        buttonText="Anbieten"
                        buttonContainerStyle={{
                            paddingVertical: 2.5,
                            borderRadius: 20,
                            width: 80
                        }}
                        colors={ !consumerMode ? activeSwitchStyle.colors : inactiveSwitchStyle.colors}
                        onPress={toggleSwitch}
                        textColor={ !consumerMode ? activeSwitchStyle.textColor : inactiveSwitchStyle.textColor}
                        fontStyle={FONTS.body3}
                    />
            </View>
        )
    }

    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginHorizontal: SIZES.padding,
                    alignItems: 'center',
                    height: 80,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: COLORS.black,
                            ...FONTS.h2
                        }}
                    >
                        Hallo {user.surName}
                    </Text>
                    <Text
                        style={{
                            marginTop: 3,
                            color: COLORS.gray,
                            ...FONTS.body3
                        }}
                    >
                        {consumerMode ? "Schau dir Menüs in deiner Nähe an": "Was möchtest du heute anbieten?"}
                    </Text>
                </View>
            </View>
        )
    }

    function renderCategoryHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                    marginHorizontal: SIZES.padding,
                }}
            >
                <Text style={{ flex: 1, ...FONTS.h2 }}>Menüs in deiner Nähe</Text>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            {consumerMode ? <FlatList
                data={menu}
                keyExtractor={item => `${item.id}`}
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {renderSwitch()}
                        {renderHeader()}
                        {/*renderSearchBar()*/}
                        {/*renderSeeRecipeCard()*/}
                        {/*renderTrendingSection()*/}
                        { consumerMode ? renderCategoryHeader() : "Render form here"}
                    </View>
                }
                renderItem={({ item }) => {
                    return (
                        <CategoryCard
                            containerStyle={{
                                marginHorizontal: SIZES.padding
                            }}
                            categoryItem={item}
                            onPress={() => navigation.navigate("OrderDetail", { order: item })}
                        />
                    )
                }}
                ListFooterComponent={
                    <View style={{ marginBottom: 100 }}></View>
                }
            /> : <Text></Text>}
        </SafeAreaView>
    )
}
export default Home;