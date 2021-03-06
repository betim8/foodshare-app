import React from "react";
import {
    View,
    TouchableOpacity,
    Text,
    Image
} from "react-native";
import { Entypo } from '@expo/vector-icons'; 
import { COLORS, FONTS, SIZES, } from "../constants";
import { Avatar } from "native-base";
import Moment from 'moment';

const CategoryCard = ({ containerStyle, categoryItem, onPress, isConsumerMode }) => {
    const date = new Date(categoryItem.pickUpTime.seconds*1000);
    const pickupTime = Moment(date).format('HH:mm')
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                marginTop: 10,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.gray2,
                ...containerStyle
            }}
            onPress={onPress}
        >
            <Image
                source={categoryItem.recipeImgSrc}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: SIZES.radius
                }}
                resizeMode="cover"
            />
            <View
                style={{
                    width: '70%',
                    paddingLeft: 20
                }}
            >
                 { isConsumerMode ? <Text
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignSelf: 'flex-end',
                        color: COLORS.black,
                        ...FONTS.body5,
                    }}
                >
                    <Entypo name="location-pin" size={20} color={COLORS.darkLime} /> 0.2km  |  <Entypo name="clock" size={18} color={COLORS.darkLime}  />  {pickupTime}
                </Text> : <View></View>}

                <Text
                    style={{
                        flex: 1,
                        ...FONTS.h2,
                    }}
                >
                    {categoryItem.recipeName}
                </Text>
                {isConsumerMode ? <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
                <Text
                    style={{
                        color: COLORS.gray,
                        ...FONTS.body4
                    }}
                >
                    von {categoryItem.fromUserName}
                </Text>
                <Avatar bg={COLORS.black} size="sm" source={{
                    uri: categoryItem.fromUserAvatar
                    }}>
                </Avatar>
                </View> : <View></View>}
            </View>
        </TouchableOpacity>
    )
}

export default CategoryCard