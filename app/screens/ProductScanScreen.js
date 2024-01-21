import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import AddIntakeModal from "../components/AddIntakeModal";

const ProductScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [scanned, setScanned] = useState(false);
  const [scannedFood, setScannedFood] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    setScanned(false);
  }, []);

  const navigation = useNavigation();

  const fetchFoodByCode = async (code) => {
    try {
      const url = `http://192.168.1.71:3000/packaged-food/${code}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.ack === "success") {
        const food = {
          code: result.data.code,
          name: result.data.product_name,
          image: result.data.img_url,
          category: result.data.category,
        };
        setScannedFood(food);
      } else {
        console.log("Failed to fetch food by code");
        setScannedFood(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    console.log(`Bar code data ${data} has been scanned!`);
    fetchFoodByCode(data);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const renderScanedFood = () => {
    if (scannedFood === null) {
      return (
        <View style={styles.resultContainer}>
          <View style={styles.scanResult}>
            <Text style={styles.tipMessage}>Food not exist in system!</Text>
          </View>
        </View>
      );
    } else if (scannedFood) {
      return (
        <View style={styles.resultContainer}>
          <View style={styles.scanResult}>
            <Image
              style={styles.foodImage}
              source={{ uri: scannedFood.image }}
            />
            <View style={styles.foodInfo}>
              <View style={styles.foodDetails}>
                <Text style={styles.foodName}>{scannedFood.name}</Text>
                <Text style={styles.foodCategory}>{scannedFood.category}</Text>
              </View>
              <TouchableOpacity onPress={openModal}>
                <Icon name="plus" size={25} style={styles.arrowSymbol} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <View />
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.scanFrame}>
            <View style={styles.scanFrameCornerTopLeft} />
            <View style={styles.scanFrameCornerTopRight} />
            <View style={styles.scanFrameCornerBottomLeft} />
            <View style={styles.scanFrameCornerBottomRight} />
          </View>
        </Camera>
      )}
      {/* Scan Result Popout */}
      {renderScanedFood()}
      <AddIntakeModal
        username={username}
        onUpdateSugarToday={onUpdateSugarToday}
        visible={modalVisible}
        item={displayItem}
        servingSize={servingSize}
        handleServingSizeChange={handleServingSizeChange}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc1c8",
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  scanFrame: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 250,
    backgroundColor: "transparent",
  },
  scanFrameCornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
  },
  scanFrameCornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
  },
  scanFrameCornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
  },
  scanFrameCornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
  },
  tipMessage: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffc1c8",
  },
  resultContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  scanResult: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 80,
    borderRadius: 20,
    width: "90%",
  },
  foodImage: {
    width: 50,
    height: 50,
    marginLeft: 15,
    marginTop: 5,
    marginRight: 15,
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
    fontWeight: "bold",
    flex: 1,
    marginTop: 15,
  },
  foodCategory: {
    fontSize: 12,
    color: "#000",
    marginBottom: 12,
  },
  arrowSymbol: {
    color: "#ffc1c8",
    alignSelf: "flex-end",
    marginLeft: 15,
    marginRight: 10,
  },
});

export default ProductScanScreen;
