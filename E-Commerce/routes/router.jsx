import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from '../screens/Home'
import Login from '../screens/Login'
import RegisterUser from "../screens/RegisterUser";
import Description from "../screens/Description";

const Stack = createNativeStackNavigator();

export default function Router(){
    return(
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Home"
                component={Home}
                // options={{
                //     headerTitle: () => null,
                // }}
                options={{ headerShown: false }}
                
                />
            
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            >
            </Stack.Screen>

            <Stack.Screen
                name="RegisterUser"
                component={RegisterUser}
                options={{ headerShown: false }}
            ></Stack.Screen>
            
            <Stack.Screen
                name="Description"
                component={Description}
                options={{ headerShown: false }}
            >   

            </Stack.Screen>

        </Stack.Navigator>
    </NavigationContainer>
    )
}