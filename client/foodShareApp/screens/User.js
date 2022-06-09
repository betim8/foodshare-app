import React, { useState, useEffect, useContext } from 'react';
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore"; 
import { db } from '../App';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';
import { FONTS, COLORS, icons, images, SIZES, dummyData } from "../constants";

const User = () => {
    return (
        <SafeAreaView style={{backgroundColor: '#FFF', flex: 1}}>
            <ScrollView style={{padding: SIZES.padding}} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
                <Image style={{borderRadius: 75, height: 150, marginBottom: SIZES.margin, width: 150}} resizeMode={'cover'} source={require('../assets/images/dummy_profiles/profile-pic-2.png')} />
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: SIZES.margin, width: '100%'}}>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', marginHorizontal: SIZES.marginRight, paddingHorizontal: SIZES.padding, paddingVertical: '10px'}} onPress={() => {}}>
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Editieren</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', paddingHorizontal: SIZES.padding, paddingVertical: '10px'}} onPress={() => {}}>
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Abmelden</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color: COLORS.black, ...FONTS.body2, marginBottom: SIZES.margin, marginTop: SIZES.margin}}>Stefan Müller</Text>
                <Text style={{color: COLORS.gray, ...FONTS.body3, marginBottom: SIZES.margin}}>About me: Ich bin ein leidenschaftlicher Koch und koche vor allem viel vegane Gerichte. Gruss Stefan</Text>
                <View style={{flexDirection: 'row', marginBottom: SIZES.margin, width: '100%'}}>
                    <Ionicons name="earth" size={24} style={{color: COLORS.darkLime, marginRight: SIZES.marginRight}} />
                    <Text style={{color: COLORS.gray, ...FONTS.body3}}>Schweiz</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: SIZES.margin, width: '100%'}}>
                    <Ionicons name="location" size={24} style={{color: COLORS.darkLime, marginRight: SIZES.marginRight}} />
                    <Text style={{color: COLORS.gray, ...FONTS.body3}}>Thalwil</Text>
                </View>
                <Text style={{color: COLORS.black, ...FONTS.body3, marginBottom: SIZES.margin, marginTop: SIZES.margin}}>Aktuelle Bewertung:</Text>
                <Rating
                    ratingColor='#3498db'
                    imageSize={25}
                    readonly={true}
                    startingValue={4}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default User;