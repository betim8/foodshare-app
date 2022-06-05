import React, { useRef } from "react"
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    Platform,
    ActivityIndicator
} from "react-native";
import { db } from '../App';
import Moment from 'moment';
import { Fab } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import { getDoc, doc, setDoc } from "firebase/firestore";
import { BlurView } from 'expo-blur';
import { SIZES, FONTS, icons, COLORS } from "../constants"

const HEADER_HEIGHT = 350;

const RecipeCreatorCardDetail = ({ selectedOrder }) => {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    width: 40,
                    height: 40,
                    marginLeft: 20,
                }}>
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
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        tintColor: COLORS.white2
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}

const RecipeCreatorCardInfo = ({ selectedOrder }) => {
    if (Platform.OS === 'ios') {
        return (
            <BlurView
                style={{
                    flex: 1,
                }}
                blurType="dark"
            >
                <RecipeCreatorCardDetail
                    selectedOrder={selectedOrder}
                />
            </BlurView>
        )
    } else {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: COLORS.transparentBlack5
                }}
            >
                <RecipeCreatorCardDetail
                    selectedOrder={selectedOrder}
                />
            </View>
        )
    }
}

const OrderDetail = ({ navigation, route }) => {

    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [recipeDetail, setRecipeDetail] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const scrollY = useRef(new Animated.Value(0)).current;


    React.useEffect(() => {
        console.log(route.params);
        let { order } = route.params;
        const date = new Date(order.pickUpTime.seconds * 1000);
        order['pickupInH'] = Moment(date).format('HH:mm');
        getData(order);
        setSelectedOrder(order);
    }, [])

    async function getData(order) {
        const recipeDetail = await getDoc(doc(db, "recipes", order.recipeId));
        recipeDetail.data().ingredients.sort((a, b) =>  a.amount - b.amount);
        var sorted = recipeDetail.data();
        sorted.ingredients.sort((a, b) =>  b.amount - a.amount);
        setRecipeDetail(sorted);
        console.log(recipeDetail.data());
        setIsLoading(false);
    }

    function renderHeaderBar() {
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
        )
    }

    function renderRecipeCardHeader() {
        return (
            <View
                style={{
                    marginTop: -1000,   // To make sure header image doesn't scroll
                    paddingTop: 1000,   // To make sure header image doesn't scroll
                    alignItems: 'center',
                    overflow: 'hidden',
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
                                })
                            }
                        ]
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
                                    extrapolate: 'clamp'
                                }),
                            },
                        ]
                    }}
                >
                    <RecipeCreatorCardInfo
                        selectedOrder={selectedOrder}
                    />
                </Animated.View>
            </View>
        )
    }

    function renderRecipeInfo() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: 130,
                    width: SIZES.width,
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                    alignItems: 'center',
                }}
            >
                {/* Recipe Name */}
                <View
                    style={{
                        flex: 1.5,
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ color: COLORS.black, ...FONTS.h2 }}>{selectedOrder?.recipeName}</Text>
                    <Text
                        style={{
                            marginTop: 5,
                            color: COLORS.darkLime,
                            ...FONTS.body3
                        }}
                    >
                        Abholbereit um: {selectedOrder?.pickupInH}
                    </Text>
                </View>
            </View >
        )
    }

    function renderIngredientHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: 30,
                    marginTop: SIZES.radius,
                    marginBottom: SIZES.padding - 20
                }}
            >
                <Text
                    style={{
                        flex: 1,
                        ...FONTS.h3
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
        )
    }

    function renderIngredients() {
        return (
            <Text style={{
                color: COLORS.black,
                paddingHorizontal: 30,
                ...FONTS.body4,
            }}>
                {recipeDetail?.ingredients.map((ing) => {
                    return ing.name + ', '
                })}
            </Text>
        )
    }

    function renderNutrients() {
        let totalMealNutr = {
            carbs: 0,
            proteins: 0,
            fat: 0,
            kcal: 0
        };
        recipeDetail.ingredients.forEach((ing) => {
                totalMealNutr.carbs += isNaN(ing.carbs) ?  0 : ing.carbs;
                totalMealNutr.kcal += isNaN(ing.kcal) ? 0 : ing.kcal;
                totalMealNutr.proteins += isNaN(ing.protein) ? 0 : ing.protein;
                totalMealNutr.fat += isNaN(ing.fat) ? 0 : ing.fat;
        })
        return (
            <View
                style={{
                    flexDirection: 'column',
                    paddingHorizontal: 30,
                    marginTop: SIZES.padding,
                    marginBottom: SIZES.padding - 20
                }}
            >
                <View style={{flexDirection: 'row'}}>
                <Text
                    style={{
                        flex: 1,
                        color: COLORS.black,
                        ...FONTS.h3
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
                <View style={{flexDirection: 'row'}}>
                <Text
                    style={{
                        flex: 1,
                        color: COLORS.black,
                        ...FONTS.body4
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
                <View style={{flexDirection: 'row'}}>
                <Text
                    style={{
                        flex: 1,
                        color: COLORS.black,
                        ...FONTS.body4
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
                <View style={{flexDirection: 'row'}}>
                <Text
                    style={{
                        flex: 1,
                        color: COLORS.black,
                        ...FONTS.body4
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
        )
    }

    async function requestOrder() {
        console.log("letsgo");

        var updatedOrder = {
            ...selectedOrder,
             //TODO Replace with Auth getUser
        }
        console.log(updatedOrder);
        //await setDoc(doc(db, 'orders', updatedOrder.id), { status: updatedOrder.status, toUserUid: updatedOrder.toUserUid }, { merge: true });
        setSelectedOrder(updatedOrder);
        console.log(selectedOrder);
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            {isLoading ? <ActivityIndicator size="small" color="#0000ff" /> :
                <View>
                    {renderRecipeCardHeader()}
                    {renderRecipeInfo()}
                    {renderIngredientHeader()}
                    {renderIngredients()}
                    {renderHeaderBar()}
                    {renderNutrients()}
                    <View style={{paddingBottom: 100}}></View>
                    <Fab onPress={requestOrder} backgroundColor={selectedOrder.status === 'active' ? COLORS.transparentBlack9 : COLORS.transparentBlack5} renderInPortal={false} shadow={2} right={140} size="sm" icon={<Ionicons name="fast-food" size={24} color="white" />} label={selectedOrder.status === 'active' ? (<Text style={{ color: COLORS.white, ...FONTS.body4 }} fontSize="sm">Anfragen</Text>) : (<Text style={{ color: COLORS.white, ...FONTS.body4 }} fontSize="sm">Angefragt...</Text>)} />
                </View>
            }

            {/* Header Bar */}
        </View>

    )
}

export default OrderDetail;