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
import { getDoc, doc } from "firebase/firestore"; 
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
                <Text style={{ color: COLORS.lightGray2, ...FONTS.body4 }}>Menü von:</Text>
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
                        tintColor: COLORS.lightGreen1
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
                    borderRadius: SIZES.radius,
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
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.transparentBlack9,
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
        const date = new Date(order.pickUpTime.seconds*1000);
        order['pickupInH'] = Moment(date).format('HH:mm');
        getData(order);
        setSelectedOrder(order);
    }, [])

    const getData = async (order) => {
        //const recipeDetailQuery = query(collection(db, "recipes"), where("id", "==", "active"));
        //const orderRef = await getDocs(orderQuery);
        const recipeDetail = await getDoc(doc(db, "recipes",order.recipeId));
        setRecipeDetail(recipeDetail.data());
        setIsLoading(false);
    };

    function renderHeaderBar() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 90,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: 10,
                }}
            >
                {/* Screen Overlay */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: COLORS.black,
                        opacity: scrollY.interpolate({
                            inputRange: [HEADER_HEIGHT - 100, HEADER_HEIGHT - 70],
                            outputRange: [0, 1],
                        }),
                    }}
                />

                {/* Header Bar Title */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingBottom: 10,
                        opacity: scrollY.interpolate({
                            inputRange: [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
                            outputRange: [0, 1],
                        }),
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
                                    outputRange: [50, 0],
                                    extrapolate: 'clamp'
                                }),
                            },
                        ]
                    }}
                >
                    <Text style={{ color: COLORS.lightGray2, ...FONTS.body4 }}>Menü von:</Text>
                    <Text style={{ color: COLORS.white2, ...FONTS.h3 }}>{selectedOrder?.fromUserName}</Text>
                </Animated.View>

                {/* Back button */}
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 35,
                        width: 35,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: COLORS.lightGray,
                        backgroundColor: COLORS.transparentBlack5,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        style={{
                            width: 15,
                            height: 15,
                            tintColor: COLORS.lightGray
                        }}
                    />
                </TouchableOpacity>

                {/* Bookmark */}
                {/* <TouchableOpacity
                    onPress={() => console.log("Bookmark")}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 35,
                        width: 35,
                    }}
                >
                    <Image source={selectedOrder?.isBookmark ? icons.bookmarkFilled : icons.bookmark} style={{ width: 30, height: 30, tintColor: COLORS.darkGreen }} />
                </TouchableOpacity> */}
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
                        position: 'absolute',
                        bottom: 10,
                        left: 30,
                        right: 30,
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
                    <Text style={{ ...FONTS.h2 }}>{selectedOrder?.name}</Text>
                    <Text
                        style={{
                            marginTop: 5,
                            color: COLORS.darkGreen,
                            ...FONTS.body4
                        }}
                    >
                        Abholbereit um: {selectedOrder?.pickupInH}
                    </Text>
                </View>

                {/* Viewers */}
                {/* <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Viewers viewersList={selectedOrder?.viewers} />
                </View> */}
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
                    marginBottom: SIZES.padding
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

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            {isLoading ?     <ActivityIndicator size="small" color="#0000ff" /> :
            <Animated.FlatList
                data={recipeDetail?.ingredients}
                keyExtractor={item => `${item.ingredientId}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {renderRecipeCardHeader()}
                        {renderRecipeInfo()}
                        {renderIngredientHeader()}
                    </View>
                }
                scrollEventThrottle={16}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { y: scrollY } } }
                ], { useNativeDriver: true })}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 30,
                            marginVertical: 5,
                        }}
                    >
                        {/* Icon */}
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 50,
                                width: 50,
                                borderRadius: 5,
                                backgroundColor: COLORS.lightGray,
                            }}
                        >
                            <Image
                                source={item.icon}
                                style={{
                                    height: 40,
                                    width: 40
                                }}
                            />
                        </View>

                        {/* Description */}
                        <View
                            style={{
                                flex: 1,
                                paddingHorizontal: 20,
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ ...FONTS.body3 }}>{item.name}</Text>
                        </View>

                        {/* Quantity */}
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'flex-end'
                            }}
                        >
                            <Text style={{ ...FONTS.body3 }}>{item.amount} g</Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={
                    <View
                        style={{
                            marginBottom: 100
                        }}
                    />
                }
            /> }

            {/* Header Bar */}
            {renderHeaderBar()}
        </View>

    )
}

export default OrderDetail;