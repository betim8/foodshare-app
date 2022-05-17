import React from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';
import { Home, Menu, OrderDelivery } from './screens';

const Stack = createStackNavigator();

const firebaseConfig = {
    apiKey: "AIzaSyCtF3dLMjn3wFZihvrMdXHz9DXPOQ3HVnI",
    authDomain: "foodshare-ee888.firebaseapp.com",
    projectId: "foodshare-ee888",
    storageBucket: "foodshare-ee888.appspot.com",
    messagingSenderId: "605709039803",
    appId: "1:605709039803:web:8d45712c734f08898c119e",
    measurementId: "G-3T46W0XP68"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db, app};
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'Home'}
            >
                <Stack.Screen name='Home' component={Tabs} />
                <Stack.Screen name='Menu' component={Menu} />
                <Stack.Screen name='OrderDelivery' component={OrderDelivery} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;