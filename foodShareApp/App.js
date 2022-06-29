import React from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';
import { Hidden, NativeBaseProvider, View } from "native-base";
import { Search, AddRecipe, OrderDetail, RecipeDetail, User, OrderOverview, ConfirmedOrder} from './screens';
import { useFonts } from 'expo-font';
import algoliasearch from 'algoliasearch/lite';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig, appId, apiKey } from "./localSecrets";

const searchClient = algoliasearch(appId, apiKey);
export { searchClient };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
var ui = new firebaseui.auth.AuthUI(auth);
export { db, app, auth };


const Stack = createStackNavigator();
const App = () => {

    const [loggedIn, setLoggedIn] = React.useState(null);

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
        console.log("test")
        if (user) {     
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    });

    return (
        <NativeBaseProvider>
            <div style={{display: loggedIn || loggedIn === null ? "none" : "inline"}} id="firebaseui-auth-container"></div> 
            {
                loggedIn ? (<NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}
                        initialRouteName={'Nav'}
                    >
                        <Stack.Screen name='Nav' component={Tabs} />
                        <Stack.Screen name='Search' component={Search} />
                        <Stack.Screen name="OrderDetail" component={OrderDetail} />
                        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
                        <Stack.Screen name="OrderOverview" component={OrderOverview} />
                        <Stack.Screen name='AddRecipe' component={AddRecipe} />
                        <Stack.Screen name="User" component={User}/>
                        <Stack.Screen name="ConfirmedOrder" component={ConfirmedOrder}/>
                    </Stack.Navigator>
                </NavigationContainer>) : <></>
            }
        </NativeBaseProvider>
    )
}

export default App;