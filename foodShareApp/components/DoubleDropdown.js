import React from "react"
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import { FONTS, COLORS, SIZES } from "../constants";
const DoubleDropdown = ({ data, selectedIngredients }) => {
    const [isFocusZutat, setIsFocusZutat] = React.useState(false);
    const [isFocusEinheit, setIsFocusEinheit] = React.useState(false);
    const [measureData, setMeasureData] = React.useState(null);
    const [selectedMeas, setSelectedMeas] = React.useState(null);
    const [selectedAmount, setSelecetedAmount] = React.useState(null);
    const [selectedIng, setSelectedIng] = React.useState(null);


    React.useEffect(() => {
        console.log(data);
    }, []);

    React.useEffect(() => {
        calc();

    }, [selectedMeas, selectedAmount, selectedIng]);


    function prepareMeasures(item) {    
        setSelectedIng(item);    
        var measures = [];
        console.log("inside doubledropdown")
        for(var i in item.units) {
            console.log(i);
            measures.push(
                {
                    key:i,
                    value:item.units[i]
                }
            )
        }
        setMeasureData(measures);
    }

    function prepareSelectedMeas(item) {
        setSelectedMeas(item);
    }

    function prepareSelectedAmount(item) {
        console.log(item);
        let amount = parseInt(item);
        console.log('amoung', amount)
        setSelecetedAmount(amount);
    }


    function calc() {
        console.log("caaalc")
        if (selectedAmount && selectedIng && selectedMeas) {
            var existing = selectedIngredients.find(a => a.ingredientId == selectedIng.id);
            var amount = Math.round(selectedAmount * selectedMeas.value * 100) / 100;
            console.log("calc amount", selectedAmount);
            if (existing) {
                existing.amount = amount,
                existing.carbs=Math.round(selectedIng.carbs / 100 * amount),
                existing.fat=Math.round(selectedIng.fat / 100 * amount),
                existing.protein=Math.round(selectedIng.protein / 100 * amount),
                existing.kcal=Math.round(selectedIng.kcal / 100 * amount),
                existing.recipeCount= 1,
                existing.isOptional= false,
                existing.ingredientType= "",
                existing.ingredientId= selectedIng.id,
                existing.name= selectedIng.name
            } else {
                selectedIngredients.push(
                    {
                        amount: amount,
                        carbs:Math.round(selectedIng.carbs / 100 * amount),
                        fat:Math.round(selectedIng.fat / 100 * amount),
                        protein:Math.round(selectedIng.protein / 100 * amount),
                        kcal:Math.round(selectedIng.kcal / 100 * amount),
                        recipeCount: 1,
                        isOptional: false,
                        ingredientType: "",
                        ingredientId: selectedIng.id,
                        name: selectedIng.name
                    }
                )
            }  
        }
    }


   return (
    <View style={{ flexDirection: "row", marginBottom: SIZES.margin, width: "100%" }}>
    <View style={{ marginBottom: SIZES.margin, marginRight: "5%" }}>
      <Dropdown
        style={{
            width: 179,
          borderColor: COLORS.gray,
          borderRadius: "5px",
          borderWidth: "2px",
          color: COLORS.black,
          ...FONTS.body6,
          marginTop: SIZES.margin,
          paddingHorizontal: SIZES.margin,
          paddingVertical: "3.5px",
          overflow: 'hidden'
        }}
        data={data}
        placeholderStyle={FONTS.body6}
        selectedTextStyle={FONTS.body6}
        inputSearchStyle={FONTS.body6}
        search
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder={!isFocusZutat ? "Zutat" : "..."}
        searchPlaceholder="Zutat..."
        onFocus={() => setIsFocusZutat(true)}
        onBlur={() => setIsFocusZutat(false)}
        onChange={(item) => {
          prepareMeasures(item);
          setIsFocusZutat(false);
        }}
        dropdownPosition="bottom"
      />
    </View>
   
    <View style={{ marginBottom: SIZES.margin, marginRight: "5%" }}>
      <Dropdown
        style={{
          borderColor: COLORS.gray,
          borderRadius: "5px",
          borderWidth: "2px",
          color: COLORS.black,
          width: 80,
          ...FONTS.body6,
          marginTop: SIZES.margin,
          paddingHorizontal: SIZES.margin,
          paddingVertical: "3.5px",
        }}
        placeholderStyle={FONTS.body6}
        selectedTextStyle={FONTS.body6}
        inputSearchStyle={FONTS.body6}
        data={measureData || []}
        maxHeight={300}
        labelField="key"
        valueField="value"
        placeholder={!isFocusEinheit ? "Einheit" : "..."}
        onFocus={() => setIsFocusEinheit(true)}
        onBlur={() => setIsFocusEinheit(false)}
        onChange={(item) => {
        prepareSelectedMeas(item);
          setIsFocusEinheit(false);
        }}
        dropdownPosition="bottom"
      />
    </View>
   <View style={{ marginBottom: SIZES.margin}}>
      <TextInput
        style={{
            width: 60,
          borderColor: COLORS.gray,
          borderRadius: "5px",
          borderWidth: "2px",
          color: COLORS.black,
          ...FONTS.body6,
          marginTop: SIZES.margin,
          paddingHorizontal: SIZES.margin,
          paddingVertical: SIZES.margin,
        }}
        placeholderTextColor={COLORS.black}
        placeholder={'Menge'}
        autoCorrect={false}
        onChangeText={text => prepareSelectedAmount(text)}
        />
    </View>

  </View>
   )

}

export default DoubleDropdown