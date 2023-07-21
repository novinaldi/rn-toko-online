import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, ToastAndroid } from "react-native";
import { Button, Divider, List, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import API_URL from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailOrder({ route, navigation }) {
	
	return (
		<SafeAreaView style={{
			flex: 1,
			padding: 5,
		}}>
		</SafeAreaView>
	);
}