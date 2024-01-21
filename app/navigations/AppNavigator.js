import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SugarRecordingScreen from "../screens/SugarRecordingScreen";
import ProductScanScreen from "../screens/ProductScanScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="SugarRecordingScreen"
          component={SugarRecordingScreen}
        />
        <Stack.Screen name="ProductScanScreen" component={ProductScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
