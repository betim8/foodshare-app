import React, { useState, useEffect, useContext } from 'react';
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore"; 
import { db, auth} from '../App';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Avatar } from "native-base";


import {
    View,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';
import { FONTS, COLORS, icons, images, SIZES, dummyData } from "../constants";

const User = () => {
    const [user, setUser] = React.useState(null);
    let rating = 0;
   
    function signOff() {
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }


    useEffect(() => {
        console.log("auth effect");
        onAuthStateChanged(auth, (user) => {
          console.log("letso");
          console.log(user);
          if (user) {
            getUserData(user.uid);
          } 
      });
      }, []);

      async function getUserData(userUid) {
        const userRef = await getDoc(doc(db, "users", userUid));
        var u = {id: userRef.id, ...userRef.data()};
        rating = Math.round(u.totalReviewRating/u.numOfReviews, 1);
        console.log(u);
        console.log(rating);
        setUser(u);
      }

    return (
        user ? 
        <SafeAreaView style={{backgroundColor: '#FFF', flex: 1}}>
            <ScrollView style={{padding: SIZES.padding}} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
                    <Avatar bg={COLORS.black} size="2xl" source={{ uri: user.avatar }}></Avatar>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: SIZES.margin, width: '100%'}}>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', marginHorizontal: SIZES.marginRight, paddingHorizontal: SIZES.padding, paddingVertical: '10px'}} onPress={() => {}}>
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Editieren</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', paddingHorizontal: SIZES.padding, paddingVertical: '10px'}} onPress={signOff}>
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Abmelden</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color: COLORS.black, ...FONTS.body2, marginBottom: SIZES.margin, marginTop: SIZES.margin}}>{user.surName + " " + user.lastName}</Text>
                <Text style={{color: COLORS.gray, ...FONTS.body3, marginBottom: SIZES.margin}}>{user.aboutMe}</Text>
                <View style={{flexDirection: 'row', marginBottom: SIZES.margin, width: '100%'}}>
                    <Ionicons name="earth" size={24} style={{color: COLORS.darkLime, marginRight: SIZES.marginRight}} />
                    <Text style={{color: COLORS.gray, ...FONTS.body3}}>{user.address.city}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: SIZES.margin, width: '100%'}}>
                    <Ionicons name="location" size={24} style={{color: COLORS.darkLime, marginRight: SIZES.marginRight}} />
                    <Text style={{color: COLORS.gray, ...FONTS.body3}}>{user.address.postalCode}</Text>
                </View>
                <Text style={{color: COLORS.black, ...FONTS.body3, marginBottom: SIZES.margin, marginTop: SIZES.margin}}>Aktuelle Bewertung:</Text>
                <Rating
                    ratingColor='#3498db'
                    imageSize={25}
                    readonly={true}
                    startingValue={Math.round(user.totalReviewRating/user.numOfReviews, 1)}
                />
            </ScrollView>
        </SafeAreaView> :  <ActivityIndicator size="large" color={COLORS.darkGreen} />
    )
}

export default User;