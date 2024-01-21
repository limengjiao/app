import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AddIntakeModal from "./AddIntakeModal";

const PredictionList = ({ username, onUpdateSugarToday }) => {
  const [predictionItems, setPredictionItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayItem, setDisplayItem] = useState(null);
  const [servingSize, setServingSize] = useState(1);

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
  }, [username]);

  const addPress = (item) => {
    setDisplayItem(item);
    setServingSize(item.serving);
    setModalVisible(true);
  };

  const handleServingSizeChange = (newSize) => {
    setServingSize(newSize);
  };

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

  return (
    <>
      <FlatList
        data={predictionItems}
        renderItem={renderPredictItems}
        keyExtractor={(item) => item.code}
      />
      <AddIntakeModal
        username={username}
        onUpdateSugarToday={onUpdateSugarToday}
        visible={modalVisible}
        item={displayItem}
        servingSize={servingSize}
        handleServingSizeChange={handleServingSizeChange}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  plusSymbol: {
    color: "#ffc1c8",
    alignSelf: "flex-end",
    marginLeft: 16,
  },
});

export default PredictionList;
