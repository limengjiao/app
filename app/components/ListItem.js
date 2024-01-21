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

const ListItem = ({ item, addPress }) => {
  return (
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
};

const styles = StyleSheet.create({});

export default ListItem;
