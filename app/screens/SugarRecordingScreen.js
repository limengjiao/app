import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  SafeAreaView,
} from "react-native";

const image_avata = require("../../assets/avatar.png");

const SugarRecordingScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Home</Text>
        <Image style={styles.avatar} source={image_avata} />
      </View>
      {/*  */}
      <View style={styles.content}>
        <Text style={styles.title}>Hello</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#000",
  },
  topBarText: {
    fontSize: 20,
    color: "#FFF",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SugarRecordingScreen;
