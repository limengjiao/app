import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Progress from "react-native-progress";
import PredictionList from "../components/PredictionList";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context";

const image_avata = require("../../assets/avatar.png");

const SugarRecordingScreen = () => {
  const navigation = useNavigation();
  const { username, setUsername } = useUser();

  // Get today's sugar intake amount
  const [sugarIntakeToday, setSugarIntakeToday] = useState(0);

  useEffect(() => {
    if (username && username !== "Guest") {
      fetchSugarIntake();
    }
  }, [username]);

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

  const updateSugarToday = async () => {
    fetchSugarIntake();
  };

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
        <PredictionList
          username={username}
          onUpdateSugarToday={updateSugarToday}
        />
        <Text style={styles.endText}>
          Not you need? Use scan function to add.
        </Text>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => console.log("Home")}>
          <FontAwesome5 name="calendar-day" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProductScanScreen");
          }}
        >
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

  endText: {
    fontSize: 13,
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 30,
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
