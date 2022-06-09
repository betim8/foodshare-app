import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Home, Search, User } from "../screens";
import { COLORS } from "../constants";
import { AntDesign } from '@expo/vector-icons';


const Tab = createBottomTabNavigator()

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: COLORS.white,
                    borderTopColor: "transparent",
                    height: 100
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) =>  <AntDesign name="home" size={30} color={focused ? COLORS.darkGreen : COLORS.black} />,

                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => <AntDesign name="search1" size={30} color={focused ? COLORS.darkGreen : COLORS.black} />
                }}
            />
            <Tab.Screen
                name="Bookmark"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => <AntDesign name="bars" size={30} color={focused ? COLORS.darkGreen : COLORS.black} />
                }}
            />
            <Tab.Screen
                name="User"
                component={User}
                options={{
                    tabBarIcon: ({ focused }) =>  <AntDesign name="user" size={30} color={focused ? COLORS.darkGreen : COLORS.black} />
                }}
            />
        </Tab.Navigator>
    )
}

export default Tabs;