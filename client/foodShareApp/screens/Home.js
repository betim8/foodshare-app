import React, { useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../App';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Button
} from "react-native";
import { TrendingCard, CategoryCard } from "../components";
import { FONTS, COLORS, icons, images, SIZES, dummyData } from "../constants";
import { CustomButton } from "../components";

const Home = ( {navigation} ) => {

    const [menu, setMenu] = React.useState(menuData);
    const [consumerMode, setConsumerMode] = React.useState(true);

    useEffect(() => {
        getData();
    })

    const getData = async () => {
        const recipesRef = await getDocs(collection(db, "recipes"));
        recipesRef.forEach((doc) => {   
            
        });
    };



    const menuData = [];

    

    var activeSwitchStyle = {
        colors: [COLORS.black, COLORS.black],
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
                            color: COLORS.darkGreen,
                            ...FONTS.h2
                        }}
                    >
                        {"Hallo name"}
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
                {/* <TouchableOpacity
                    onPress={() => console.log("Profile")}
                >
                    <Image
                        source={images.profile}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20
                        }}
                    />
                </TouchableOpacity> */}
            </View>
        )
    }

    function renderSearchBar() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center',
                    marginHorizontal: SIZES.padding,
                    paddingHorizontal: SIZES.radius,
                    borderRadius: 10,
                    backgroundColor: COLORS.lightGray
                }}
            >
                <Image
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.gray,
                    }}
                    source={icons.search}
                />
                <TextInput
                    style={{
                        marginLeft: SIZES.radius,
                        ...FONTS.body3
                    }}
                    placeholderTextColor={COLORS.gray}
                    placeholder="Search Recipes"
                />
            </View>
        )
    }

    function renderSeeRecipeCard() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: SIZES.padding,
                    marginHorizontal: SIZES.padding,
                    borderRadius: 10,
                    backgroundColor: COLORS.lightGreen,
                }}
            >
                {/* Image */}
                <View
                    style={{
                        width: 100,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={images.recipe}
                        style={{ width: 80, height: 80 }}
                    />
                </View>

                {/* Text */}
                <View
                    style={{
                        flex: 1,
                        paddingVertical: SIZES.radius
                    }}
                >
                    <Text
                        style={{
                            width: '70%',
                            ...FONTS.body4
                        }}
                    >
                        You have 12 recipes that you haven't tried yet
                    </Text>

                    <TouchableOpacity
                        style={{
                            marginTop: 10
                        }}
                        onPress={() => console.log("See Recipes")}
                    >
                        <Text
                            style={{
                                color: COLORS.darkGreen,
                                textDecorationLine: 'underline',
                                ...FONTS.h4
                            }}
                        >
                            See Recipes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function renderTrendingSection() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding
                }}
            >
                <Text
                    style={{
                        marginHorizontal: SIZES.padding,
                        ...FONTS.h2
                    }}
                >
                    Trending Recipe
                </Text>

                <FlatList
                    data={dummyData.trendingRecipes}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item, index }) => {
                        return (
                            <TrendingCard
                                containerStyle={{
                                    marginLeft: index == 0 ? SIZES.padding : 0
                                }}
                                recipeItem={item}
                                onPress={() => navigation.navigate("Recipe", { recipe: item })}
                            />
                        )
                    }}
                />
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
                {/* <TouchableOpacity>
                    <Text
                        style={{
                            color: COLORS.gray,
                            ...FONTS.body4,
                        }}
                    >
                        View All
                    </Text>
                </TouchableOpacity> */}
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
            <FlatList
                data={dummyData.categories}
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
                        {renderCategoryHeader()}
                    </View>
                }
                renderItem={({ item }) => {
                    return (
                        <CategoryCard
                            containerStyle={{
                                marginHorizontal: SIZES.padding
                            }}
                            categoryItem={item}
                            onPress={() => navigation.navigate("Recipe", { recipe: item })}
                        />
                    )
                }}
                ListFooterComponent={
                    <View style={{ marginBottom: 100 }}></View>
                }
            />
        </SafeAreaView>
    )
}
export default Home;