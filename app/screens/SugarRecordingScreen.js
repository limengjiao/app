import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const image_avata = require("../../assets/avatar.png");

const SugarRecordingScreen = () => {
  // Get Username
  const [username, setUsername] = useState("Guest");
  useEffect(() => {
    const loadUsername = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setUsername(savedUsername);
      }
    };

    loadUsername();
  }, []);

  // Food Intake Prediction
  const [predictionItems, setPredictionItems] = useState([]);
  useEffect(() => {
    const fetchPredictionItems = async () => {
      try {
        const url = `http://localhost/users/${username}/intake-prediction`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.ack === "success") {
          const predictions = data.predictions.map((item) => ({
            code: item.food.code,
            name: item.food.product_name,
            serving: item.mostFrequentServingCount,
            image: item.food.img_url,
            category: item.food.category,
          }));
          setPredictionItems(predictions);
        } else {
          console.log("Failed to fetch predictions");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (username && username !== "Guest") {
      fetchPredictionItems();
    }
  }, []);

  const renderPredictItems = ({ item }) => (
    <View style={styles.intakePrediction}>
      <Image style={styles.foodImage} source={{ uri: item.image }} />
      <View style={styles.foodInfo}>
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodCategory}>{item.category}</Text>
        </View>
        <Text style={styles.foodServing}>{item.serving} Serving</Text>
      </View>
    </View>
  );
  // Get today's sugar intake amount
  const [sugarIntakeToday, setSugarIntakeToday] = useState(0);
  useEffect(() => {
    const fetchSugarIntake = async () => {
      try {
        const url = `http://localhost/users/${username}/sugar-intake-today`;
        const response = await fetch(url);
        const data = await response.json();
        setSugarIntakeToday(data.sugarToday);
      } catch (error) {
        console.log(error);
      }
    };
    if (username && username !== "Guest") {
      fetchSugarIntake();
    }
  }, [username]);

  // View
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Wellness Starts Here</Text>
        <Image style={styles.avatar} source={image_avata} />
      </View>
      {/*  */}
      <View style={styles.content}>
        <Text style={styles.title}>Hello {username}</Text>
        <View style={styles.roundedBox}>
          <View style={styles.textContainer}>
            <Text style={styles.intakeText}>Today</Text>
            <Text style={styles.intakeText}>Your Sugar Intake is</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{sugarIntakeToday} g</Text>
          </View>
        </View>
        <Text style={styles.subTitle}>You May Want to Record</Text>
        <FlatList
          data={predictionItems}
          renderItem={renderPredictItems}
          keyExtractor={(item) => item.code}
        />
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => console.log("Home")}>
          <FontAwesome5 name="calendar-day" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Scan")}>
          <Icon name="barcode" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Shopping")}>
          <Icon name="shopping-cart" style={styles.icon} />
        </TouchableOpacity>
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
    padding: 12,
    backgroundColor: "#ffc1c8",
  },
  topBarText: {
    fontSize: 20,
    color: "#fff",
    fontStyle: "italic",
    fontWeight: "bold",
    textShadowColor: "#fff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
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
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
  },
  roundedBox: {
    backgroundColor: "#9ad1aa",
    borderRadius: 20,
    height: 160,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    elevation: 3,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  intakeText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 8,
  },
  bubble: {
    backgroundColor: "#f8da5b",
    borderRadius: 30,
    padding: 18,
    alignSelf: "flex-start",
  },
  bubbleText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  intakePrediction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  foodImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  foodInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  foodDetails: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  foodCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  foodServing: {
    fontSize: 18,
    color: "#000",
    marginRight: 10,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#F5F5F5",
  },
  icon: {
    fontSize: 30,
    color: "#000",
  },
});

export default SugarRecordingScreen;
