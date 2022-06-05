import React from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';
import { Hidden, NativeBaseProvider, View } from "native-base";
import { Search, OrderDelivery, OrderDetail } from './screens';
import { useFonts } from 'expo-font';
import algoliasearch from 'algoliasearch/lite';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const searchClient = algoliasearch('V8UDZM4P2J', '4258a99e2a70d8e9f2decb396d73c58d');
export { searchClient };

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
const auth = getAuth(app);
var ui = new firebaseui.auth.AuthUI(auth);
export { db, app };

const Stack = createStackNavigator();
const App = () => {

    const [loggedIn, setLoggedIn] = React.useState(true);

    const [loaded] = useFonts({
        "Roboto-Black": require('./assets/fonts/Roboto-Black.ttf'),
        "Roboto-Bold": require('./assets/fonts/Roboto-Bold.ttf'),
        "Roboto-Regular": require('./assets/fonts/Roboto-Regular.ttf'),
    })
    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                console.log(authResult);
                return false;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                //document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        //signInSuccessUrl: '<url-to-redirect-to-on-success>',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
    };

    ui.start('#firebaseui-auth-container', uiConfig);

    if (!loaded) {
        return null;
    }

    onAuthStateChanged(auth, (user) => {
        console.log(user);
        if (user) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    });

    return (
        <NativeBaseProvider>
            <div style={{display: loggedIn ? "none" : "inline"}} id="firebaseui-auth-container"></div>
            {
                loggedIn ? (<NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}
                        initialRouteName={'Home'}
                    >
                        <Stack.Screen name='Home' component={Tabs} />
                        <Stack.Screen name='Search' component={Search} />
                        <Stack.Screen name='OrderDelivery' component={OrderDelivery} />
                        <Stack.Screen name="OrderDetail" component={OrderDetail} />
                    </Stack.Navigator>
                </NavigationContainer>) : <View></View>
            }
        </NativeBaseProvider>
    )
}

export default App;