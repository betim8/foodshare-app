import React, { useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../App'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icons, images, COLORS, FONTS, SIZES } from '../constants';
import { NativeBaseProvider, VStack, Center  } from "native-base";


const Home = () => {

    useEffect(() => {
        getData();
    })

    const getData = async () => {
        const recipesRef = await getDocs(collection(db, "recipes"));
        recipesRef.forEach((doc) => {
            console.log(doc.id);
            console.log(doc.data());
        });
    };



    const menuData = [];

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
        return (
            <VStack space={4} alignItems="center">
                {}
                <Center w="64" h="20" bg="indigo.300" rounded="md" shadow={3}></Center>
            </VStack>
            
            //<FlatList data={menu} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: SIZES.padding * 2 }}/>
        )
    }

    return (
        <NativeBaseProvider style={styles.container}>
            {renderHeader()}
            {renderMenu()}
        </NativeBaseProvider>
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