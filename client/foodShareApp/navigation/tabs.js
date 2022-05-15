import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import { Home } from '../screens';
import { COLORS, icons } from '../constants';

const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({accessibilityState, children, onPress }) => {
    var isSelected = accessibilityState.selected
    if(isSelected) {
        return (
            <View style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
                    <View style={{ backgroundColor: COLORS.white, flex: 1 }}></View>
                    <Svg height={60} width={70} viewBox='0 0 70 60'>
                        <Path d='M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z' fill={COLORS.white}/>
                    </Svg>
                    <View style={{ backgroundColor: COLORS.white, flex: 1 }}></View>
                </View>
                <TouchableOpacity style={{ alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 25, height: 50, justifyContent: 'center', top: -22.5, width: 50 }} onPress={onPress}>
                    {children}
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <TouchableOpacity style={{ backgroundColor: COLORS.white, flex: 1, height: 60 }} activeOpacity={1} onPress={onPress}>
                {children}
            </TouchableOpacity>
        )
    }
}

const Tabs = () => {
    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarstyle: { backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0 }}}>
            <Tab.Screen
                screenOptions={{ tabBarShowLabel: false }}
                name='Home'
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.cutlery}
                            resizeMode='contain'
                            style={{
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary,
                                width: 25
                            }}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />
            <Tab.Screen
                name='Search'
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.search}
                            resizeMode='contain'
                            style={{
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary,
                                width: 25
                            }}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />
            <Tab.Screen
                name='Like'
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.like}
                            resizeMode='contain'
                            style={{
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary,
                                width: 25
                            }}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />
            <Tab.Screen
                name='User'
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={icons.user}
                            resizeMode='contain'
                            style={{
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary,
                                width: 25
                            }}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default Tabs;