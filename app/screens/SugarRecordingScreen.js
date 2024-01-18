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
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";

const image_avata = require("../../assets/avatar.png");

const SugarRecordingScreen = () => {
  // Get Username
  const [username, setUsername] = useState("jnz121");
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
        const url = `http://192.168.1.71:3000/users/${username}/intake-prediction`;
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

  //Add intake icon event - modal window
  const [modalVisible, setModalVisible] = useState(false);
  const [displayItem, setDisplayItem] = useState(null);

  const addPress = (item) => {
    setDisplayItem(item);
    setModalVisible(true);
  };
  const renderModalContent = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          {displayItem && (
            <>
              <Image
                style={styles.modalImage}
                source={{ uri: displayItem.image }}
              />
              <Text style={styles.modalText}>{displayItem?.name}</Text>
              <TextInput style={styles.input} placeholder="Serving size: " />
              <Button title="Confirm" onPress={() => setModalVisible(false)} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderPredictItems = ({ item }) => (
    <View style={styles.intakePrediction}>
      <Image style={styles.foodImage} source={{ uri: item.image }} />
      <View style={styles.foodInfo}>
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodCategory}>{item.category}</Text>
        </View>
        <Text style={styles.foodServing}>{item.serving} Serving</Text>
        <TouchableOpacity onPress={() => addPress(item)}>
          <Icon name="plus" size={25} style={styles.plusSymbol} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Get today's sugar intake amount
  const [sugarIntakeToday, setSugarIntakeToday] = useState(0);
  useEffect(() => {
    const fetchSugarIntake = async () => {
      try {
        const url = `http://192.168.1.71:3000/users/${username}/sugar-intake-today`;
        const response = await fetch(url);
        const data = await response.json();
        const roundedSugarIntake = Math.round(data.sugarToday);
        setSugarIntakeToday(roundedSugarIntake);
      } catch (error) {
        console.log(error);
      }
    };
    if (username && username !== "Guest") {
      fetchSugarIntake();
    }
  }, [username]);

  //  Get sugar intake target
  const [sugarTarget, setSugarTarget] = useState(0);

  useEffect(() => {
    const getSugarTarget = async () => {
      try {
        const url = `http://192.168.1.71:3000/users/${username}/target`;
        const response = await fetch(url);
        const data = await response.json();
        setSugarTarget(data.sugarTarget);
      } catch (error) {
        console.log(error);
      }
    };
    if (username && username !== "Guest") {
      getSugarTarget();
    }
  }, []);

  const intakeProgress = sugarTarget > 0 ? sugarIntakeToday / sugarTarget : 0;

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
          <View style={styles.topContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.intakeText}>Today</Text>
              <Text style={styles.intakeText}>Your Sugar Intake is</Text>
            </View>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{sugarIntakeToday} g</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={intakeProgress}
              width={260}
              color="#f8da5b"
              borderColor="#fff"
            />
            <View style={styles.textContainer}>
              <Text style={styles.targetText}>{sugarTarget} g</Text>
              <Text style={styles.descText}>Limit</Text>
            </View>
          </View>
        </View>
        <Text style={styles.subTitle}>You May Want to Record</Text>
        <FlatList
          data={predictionItems}
          renderItem={renderPredictItems}
          keyExtractor={(item) => item.code}
        />
        {renderModalContent()}
        <Text style={styles.endText}>
          Not you need? Use scan function to add.
        </Text>
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
    marginBottom: 20,
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
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    borderRadius: 50,
    padding: 20,
    alignSelf: "flex-start",
  },
  bubbleText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
  },
  targetText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 18,
    marginTop: 21,
  },
  descText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 22,
    marginTop: 2,
  },
  intakePrediction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#FFE4E1",
    paddingBottom: 15,
  },
  foodImage: {
    width: 50,
    height: 50,
    marginLeft: 5,
    marginRight: 20,
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
    fontSize: 13,
    color: "#000",
    flex: 1,
    lineHeight: 15,
  },
  foodCategory: {
    fontSize: 12,
    color: "#000",
    marginTop: 0,
  },
  foodServing: {
    fontSize: 12,
    color: "#000",
    marginRight: 10,
    marginLeft: 10,
  },
  endText: {
    fontSize: 13,
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  plusSymbol: {
    color: "#ffc1c8",
    alignSelf: "flex-end",
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    height: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: 75,
    height: 75,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 15,
    color: "#000",
    flex: 1,
    lineHeight: 15,
    marginBottom: 15,
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
