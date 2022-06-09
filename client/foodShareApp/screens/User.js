import React, { useState, useEffect, useContext } from 'react';
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore"; 
import { db } from '../App';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from "react-native";
import { FONTS, COLORS, icons, images, SIZES, dummyData } from "../constants";

const User = () => {
    return (
        <SafeAreaView style={{backgroundColor: '#FFF', flex: 1}}>
            <ScrollView style={{padding: '30px'}} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
                <Image style={{borderRadius: 75, height: 150, marginBottom: '20px', width: 150}} resizeMode={'cover'} source={require('../assets/images/dummy_profiles/profile-pic-2.png')} />
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: '10px', width: '100%'}}>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', marginHorizontal: '20px', paddingHorizontal: '20px', paddingVertical: '10px'}} onPress={() => {}}>
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Editieren</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', paddingHorizontal: '20px', paddingVertical: '10px'}} onPress={() => {}}>
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Abmelden</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color: COLORS.black, ...FONTS.body2, marginBottom: '10px', marginTop: '10px'}}>Stefan Müller</Text>
                <Text style={{color: COLORS.gray, ...FONTS.body3, marginBottom: '10px'}}>About me: Ich bin ein leidenschaftlicher Koch und koche vor allem viel vegane Gerichte. Gruss Stefan</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default User;