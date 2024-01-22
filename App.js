import React from "react";
import AppNavigator from "./app/navigations/AppNavigator";
import UserProvider from "./app/context";

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
