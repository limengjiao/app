import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SugarRecordingScreen from "../screens/SugarRecordingScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={SugarRecordingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
