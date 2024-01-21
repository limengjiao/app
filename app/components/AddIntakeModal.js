import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const AddIntakeModal = ({
  username,
  onUpdateSugarToday,
  visible,
  item,
  servingSize,
  handleServingSizeChange,
  onClose,
}) => {
  const decrementServingSize = () => {
    handleServingSizeChange(Math.max(servingSize - 1, 1));
  };
  const incrementServingSize = () => {
    handleServingSizeChange(servingSize + 1);
  };

  const handleIntakeConfirm = async () => {
    const requestData = {
      username: username,
      code: item.code,
      serving_count: servingSize,
    };
    console.log(requestData);
    try {
      const response = await fetch(
        "http://192.168.1.71:3000/users/sugar-intake/add",
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error adding sugar intake:", error);
    }
    onUpdateSugarToday();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times-circle" size={28} color="#ffc1c8" />
          </TouchableOpacity>
          {item && (
            <>
              <Image style={styles.modalImage} source={{ uri: item.image }} />
              <Text style={styles.modalText}>{item?.name}</Text>
              <View style={styles.servingSizeContainer}>
                <Text style={styles.servingSizeLabel}>Serving: </Text>
                <TouchableOpacity onPress={decrementServingSize}>
                  <Text style={styles.servingSizeButton}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.servingSizeInput}
                  value={String(servingSize)}
                  onChangeText={(text) => handleServingSizeChange(Number(text))}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={incrementServingSize}>
                  <Text style={styles.servingSizeButton}>+</Text>
                </TouchableOpacity>
              </View>
              <Button title="Confirm" onPress={handleIntakeConfirm} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
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
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 15,
    color: "#000",
    flex: 1,
    lineHeight: 15,
    marginBottom: 15,
  },
  servingSizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  servingSizeButton: {
    fontSize: 25,
    color: "grey",
    paddingHorizontal: 5,
  },
  servingSizeInput: {
    borderWidth: 1,
    borderColor: "grey",
    textAlign: "center",
    backgroundColor: "#fff",
    width: 40,
    height: 30,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  servingSizeLabel: {
    fontSize: 15,
    color: "grey",
  },
});

export default AddIntakeModal;
