import React from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icons, images, COLORS, FONTS, SIZES } from '../constants';

const Home = () => {

    const menuData = [
        {

        }
    ]

    const [menu, setMenu] = React.useState(menuData)

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row', height: 50 }}>
                <TouchableOpacity style={{ justifyContent: 'center', paddingLeft: SIZES.padding * 2, width: 50 }}>
                    <Image source={icons.nearby} resizeMode='contain' style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', backgroundColor: COLORS.lightGray, borderRadius: SIZES.radius, height: '100%', justifyContent: 'center', width: '70%' }}>
                        <Text style={{ ...FONTS.h3 }}>FoodShare</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ justifyContent: 'center', paddingRight: SIZES.padding * 2, width: 50 }}>
                    <Image source={icons.basket} resizeMode='contain' style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
            </View>
        )
    }

    function renderMenu() {
        const renderItem = ({item}) => {
            <TouchableOpacity>

            </TouchableOpacity>
        }
        return (
            <FlatList data={menu} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: SIZES.padding * 2 }}/>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderMenu}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.lightGray
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            height: 3,
            width: 0
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1
    }
})

export default Home;