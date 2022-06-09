import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { InstantSearch, Hits, SearchBox, Configure } from "react-instantsearch-dom";
import { searchClient } from "../App";
import { FONTS, COLORS, SIZES } from "../constants";
import "./Search.css";

const Search = ({ navigation }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <InstantSearch searchClient={searchClient} indexName="recipes">
        <SearchBox
          translations={{
            placeholder: "Suche nach Gerichten....",
          }}
        />
        <Configure hitsPerPage={6} />
        <Hits hitComponent={SearchResult} />
      </InstantSearch>
    </ScrollView>
  );


function SearchResult({ hit }) {
  console.log(hit);
  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          marginTop: 10,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.gray2,
          marginHorizontal: SIZES.padding,
        }}
        onPress={() => navigation.navigate("RecipeDetail", { recipe: hit })}
      >
        <View style={{ width: "70%", paddingLeft: 20 }}>
          <Text style={{ flex: 1, ...FONTS.h3 }}>{hit.name}</Text>
          <Text
            style={{
              color: COLORS.lightGray2,
              ...FONTS.body6,
            }}
          >
            {hit?.ingredients.slice(0, 5).map((ing) => {
              return ing.name + ", ";
            })}
            ...
          </Text>
        </View>
        {/* <View>
          <Text>test</Text>
        </View> */}
      </TouchableOpacity>
    </View>
  );
}
};
export default Search;
