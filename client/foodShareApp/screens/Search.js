import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import { searchClient } from '../App';
import { FONTS, COLORS, icons, images, SIZES, dummyData } from "../constants";

const Search = () => {
    return (
        <View>
             <InstantSearch searchClient={searchClient} indexName="recipes">
            <SearchBox />
            <Hits hitComponent={SearchResult}/>
            </InstantSearch>
        </View>
    )
}

function SearchResult({hit}) {
    console.log(hit);
    return (
        <View>
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                marginTop: 10,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.gray2,
                marginHorizontal: SIZES.padding
            }}
            onPress={() => console.log("sda")}
        >
            <View
                style={{
                    width: '70%',
                    paddingLeft: 20
                }}
            >
                <Text
                    style={{
                        flex: 1,
                        ...FONTS.h2,
                    }}
                >
                    {hit.name}
                </Text>
            </View>
        </TouchableOpacity>
        </View>
    )
}

export default Search;