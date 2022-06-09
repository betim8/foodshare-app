import React, { useState, useEffect, useContext } from 'react';
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore"; 
import { db } from '../App';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { FONTS, COLORS, icons, images, SIZES, dummyData } from "../constants";

const dataZutat = [
    { labelZutat: 'Tomate', valueZutat: '1' },
    { labelZutat: 'Käse', valueZutat: '2' },
    { labelZutat: 'Spaghetti', valueZutat: '3' },
    { labelZutat: 'Reis', valueZutat: '4' },
    { labelZutat: 'Spätzli', valueZutat: '5' },
    { labelZutat: 'Zwiebel', valueZutat: '6' },
    { labelZutat: 'Knoblauch', valueZutat: '7' },
    { labelZutat: 'Erdnussöl', valueZutat: '8' },
];

const dataEinheit = [
    { labelEinheit: 'Esslöfel (EL)', valueEinheit: '11' },
    { labelEinheit: 'Kaffeelöfel (KL)', valueEinheit: '12' },
    { labelEinheit: 'Prise', valueEinheit: '13' },
    { labelEinheit: 'Stückzahl', valueEinheit: '14' },
    { labelEinheit: 'g', valueEinheit: '15' },
    { labelEinheit: 'l', valueEinheit: '16' },
    { labelEinheit: 'mcl', valueEinheit: '17' },
    { labelEinheit: 'ml', valueEinheit: '18' },
];

const AddRecipe = () => {
    const [value, setValue] = useState(null);
    const [isFocusZutat, setIsFocusZutat] = useState(false);
    const [isFocusEinheit, setIsFocusEinheit] = useState(false);

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

    return (
        <SafeAreaView style={{backgroundColor: '#FFF', flex: 1}}>
            {renderHeaderBar()}
            <ScrollView style={{padding: SIZES.padding}} contentContainerStyle={{justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
                <View style={{alignItems: 'center', justifyContent: 'center', marginBottom: SIZES.padding}}>
                    <Text style={{color: COLORS.black, ...FONTS.h2}}>Gericht hinzufügen</Text>
                </View>
                <TextInput style={{borderColor: COLORS.gray, borderRadius: '5px', borderWidth: '2px', color: COLORS.black, ...FONTS.body3, marginBottom: SIZES.margin, marginTop: SIZES.margin, paddingHorizontal: SIZES.margin, paddingVertical: SIZES.margin}} placeholder="Name des Gerichts" placeholderTextColor={COLORS.gray} autoCorrect={false} />
                <View style={{justifyContent: 'center', marginBottom: SIZES.padding}}>
                    <Text style={{color: COLORS.black, ...FONTS.body3}}>Folgend können die Zutaten hinzugefügt werden.</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: SIZES.margin, width: '100%'}}>
                    <View style={{flex: 0.33, marginBottom: SIZES.margin, marginRight: '5%'}}>
                        <Text style={{color: COLORS.black, ...FONTS.body3}}>Zutat:</Text>
                        <Dropdown style={{borderColor: COLORS.gray, borderRadius: '5px', borderWidth: '2px', color: COLORS.black, ...FONTS.body3, marginTop: SIZES.margin, paddingHorizontal: SIZES.margin, paddingVertical: '3.5px'}} data={dataZutat} search maxHeight={300} labelField="labelZutat" valueField="valueZutat" placeholder={!isFocusZutat ? 'Zutat' : '...'} searchPlaceholder="Zutat..." value={value} onFocus={() => setIsFocusZutat(true)} onBlur={() => setIsFocusZutat(false)} onChange={item => {setValue(item.value); setIsFocusZutat(false); }} dropdownPosition="bottom"/>
                    </View>
                    <View style={{flex: 0.33, marginBottom: SIZES.margin, marginRight: '5%'}}>
                        <Text style={{color: COLORS.black, ...FONTS.body3}}>Menge:</Text>
                        <TextInput style={{borderColor: COLORS.gray, borderRadius: '5px', borderWidth: '2px', color: COLORS.black, ...FONTS.body3, marginTop: SIZES.margin, paddingHorizontal: SIZES.margin, paddingVertical: SIZES.margin}} placeholder="Menge" placeholderTextColor={COLORS.gray} autoCorrect={false} />
                    </View>
                    <View style={{flex: 0.33, marginBottom: SIZES.margin}}>
                        <Text style={{color: COLORS.black, ...FONTS.body3}}>Einheit:</Text>
                        <Dropdown style={{borderColor: COLORS.gray, borderRadius: '5px', borderWidth: '2px', color: COLORS.black, ...FONTS.body3, marginTop: SIZES.margin, paddingHorizontal: SIZES.margin, paddingVertical: '3.5px'}} data={dataEinheit} search maxHeight={300} labelField="labelEinheit" valueField="valueEinheit" placeholder={!isFocusEinheit ? 'Einheit' : '...'} searchPlaceholder="Einheit..." value={value} onFocus={() => setIsFocusEinheit(true)} onBlur={() => setIsFocusEinheit(false)} onChange={item => {setValue(item.value); setIsFocusEinheit(false); }} dropdownPosition="bottom"/>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: SIZES.margin, width: '100%'}}>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', flexDirection: 'row', paddingHorizontal: SIZES.padding, paddingVertical: '10px'}} onPress={() => {}}>
                        <Ionicons name="add-circle" size={24} style={{color: COLORS.white, marginRight: SIZES.margin}} />
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Zutat hinzufügen</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: SIZES.margin, width: '100%'}}>
                    <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', flexDirection: 'row', paddingHorizontal: SIZES.padding, paddingVertical: '10px'}} onPress={() => {}}>
                        <Ionicons name="add-circle" size={24} style={{color: COLORS.white, marginRight: SIZES.margin}} />
                        <Text style={{color: COLORS.white, ...FONTS.body4}}>Gericht hinzufügen</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AddRecipe;