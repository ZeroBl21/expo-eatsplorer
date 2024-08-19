import React, { useCallback, useEffect, useState } from "react";
import {
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import FormField from "@/components/FormField";
import { images } from "@/constants";

import api from "@/api/db";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/auth-context";
import { router, useFocusEffect } from "expo-router";

const App = () => {
	const [items, setItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [refreshTrigger, setRefreshTrigger] = useState(0); // Nuevo estado

	const { authState } = useAuth();

	useEffect(() => {
		async function searchFavorites() {
			const res = await api.savedRecipes.list(authState?.token);
			console.log("Guardadas", res);
			if (!res.isSuccess) return;
			setItems(res.recipes);
		}

		if (authState?.token) {
			searchFavorites();
		}
	}, [authState?.token, refreshTrigger]);

	const filteredItems = items.filter((item) =>
		item.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	useFocusEffect(
		useCallback(() => {
			setRefreshTrigger((prev) => prev + 1); // Forzar una actualización al entrar a la página
		}, []),
	);

	async function toggleFavorite(id: number) {
		const updatedItems = filteredItems.map((item) => {
			if (item.id === id) {
				return { ...item, saved: !item.saved };
			}
			return item;
		});

		setItems(updatedItems);

		try {
			const response = await api.savedRecipes.delete(authState?.token, id);
			if (!response.isSuccess) {
				throw new Error(response.error || "Error al eliminar la receta.");
			}

			setRefreshTrigger((prev) => prev + 1); // Incrementa el trigger
		} catch (error) {
			console.error(error);
			const revertedItems = updatedItems.map((item) => {
				if (item.id === id) {
					return { ...item, saved: !item.saved };
				}
				return item;
			});
			setItems(revertedItems);
		}
	}

	return (
		<SafeAreaView className="bg-primary mt-6 flex-1 py-6 px-4">
			<FormField
				title=""
				placeholder="Buscar recetas guardadas..."
				type="text"
				value={searchTerm}
				handleChangeText={setSearchTerm}
			/>
			<ScrollView className="gap-y-4 w-full mx-auto mt-1 px-2">
				{filteredItems?.length <= 0 || !items ? (
					<Text>Sin Resultados</Text>
				) : null}
				{filteredItems.map((item) => (
					<Card key={item.id} item={item} toggleFavorite={toggleFavorite} />
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

const randomImage = [images.moro, images.meat, images.rice];

function Card({ item, toggleFavorite }) {
	return (
		<View className="flex-row bg-offwhite mt-2 p-4 rounded-md border border-gray-300">
			<View className="self-center">
				<Image
					className="rounded-md h-24 w-24"
					source={
						item.image && typeof item.image === "string"
							? { uri: item.image }
							: randomImage[(item.id + 1) % 3]
					}
					resizeMode="cover"
				/>
			</View>

			<View className="px-2">
				<View className="flex-row">
					<Text
						className="text-sm flex-[60%] font-inter-medium"
						onPress={() => router.push(`/search/${item.id}`)}
						numberOfLines={2}
					>
						{item.title ?? "Moro de Guandules"}
					</Text>
				</View>
				<View className="gap-2 flex-row">
					<Text className="text-xs text-brand">
						@{item.username ?? "Loading..."}
					</Text>
					<Text className="text-xs">{item.likes ?? 0} Likes</Text>
				</View>
				<View className="flex-row">
					<Text className="text-xs flex-1" numberOfLines={4}>
						{item.description ?? "Sin Descripción"}
					</Text>
				</View>
			</View>

			<TouchableOpacity
				className="ml-auto"
				activeOpacity={0.7}
				onPress={() => toggleFavorite(item.id)}
			>
				<TabBarIcon className="p-1" size={30} name={"bookmark"} color={"red"} />
			</TouchableOpacity>
		</View>
	);
}

export default App;
