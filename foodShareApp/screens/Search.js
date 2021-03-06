import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { InstantSearch, Hits, SearchBox, Configure } from "react-instantsearch-dom";
import { searchClient, auth, db } from "../App";
import { FONTS, COLORS, SIZES } from "../constants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Search.css";

const Search = ({ navigation }) => {

  const [user, setUser] = React.useState(null);


  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserData(user.uid);
      } 
  });
  }, []);

  async function getUserData(userUid) {
    const userRef = await getDoc(doc(db, "users", userUid));
    setUser({
      id: userRef.id,
      ...userRef.data()
    });
  }

  return (
    user ? (
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
      <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: SIZES.margin, width: '100%'}}>
        <TouchableOpacity style={{backgroundColor: COLORS.darkLime, borderRadius: '30px', flexDirection: 'row', paddingHorizontal: SIZES.padding, paddingVertical: '10px'}} onPress={() => navigation.navigate("AddRecipe", { user: user })}>
          <Ionicons name="add-circle" size={24} style={{color: COLORS.white, marginRight: SIZES.margin}} />
          <Text style={{color: COLORS.white, ...FONTS.body4}}>Gericht hinzufügen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>) : <></>
  );


function SearchResult({ hit }) {
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
        onPress={() => navigation.navigate("RecipeDetail", { recipe: hit, user: user })}
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
