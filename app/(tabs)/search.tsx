import React, { useEffect, useState } from "react";
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
import MultiSelect from "@/components/MultiSelect";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";

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
				<TabBarIcon
					className="p-1"
					size={30}
					name={item?.saved ? "bookmark" : "bookmark-outline"}
					color={"red"}
				/>
			</TouchableOpacity>
		</View>
	);
}

const data = [
	{
		id: 1,
		image: images.moro,
		saved: true,
		title: "Moro de Guandules",
		description: "This is the content of card 1",
		likes: 100,
	},
	{
		id: 2,
		image: images.rice,
		saved: false,
		title: "Arroz con Pollo",
		description: "This is the content of card 2",
		likes: 100,
	},
	{
		id: 3,
		image: images.meat,
		saved: false,
		title: "Carne Asada",
		description: "This is the content of card 3",
		likes: 100,
	},
	{
		id: 4,
		image: images.moro,
		saved: true,
		title: "Moro de Guandules",
		description: "This is the content of card 1",
		likes: 100,
	},
	{
		id: 5,
		image: images.rice,
		saved: false,
		title: "Arroz con Pollo",
		description: "This is the content of card 2",
		likes: 100,
	},
	{
		id: 6,
		image: images.meat,
		saved: true,
		title: "Carne Asada",
		description: "This is the content of card 3",
		likes: 100,
	},
];

const filters = [
	{
		name: "Nombre",
		id: 0,
	},
	{
		name: "Ingrediente",
		id: 1,
	},
	{
		name: "Tag",
		id: 2,
	},
	{
		name: "Sin Ingrediente",
		id: 3,
	},
];

const Search = () => {
	const [items, setItems] = useState(data);
	const [filter, setFilter] = useState([filters[0].id]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchTermArray, setSearchTermArray] = useState([]);
	const [options, setOptions] = useState([]);

	const { authState } = useAuth();

	useEffect(() => {
		async function updateOptions() {
			try {
				if (filter[0] === 1 || filter[0] === 3) {
					// Ingrediente
					const res = await api.ingredients.list(authState?.token);
					setOptions(res.ingredients);
				} else if (filter[0] === 2) {
					// Tag
					const res = await api.tags.list(authState?.token);
					setOptions(res.tags);
				} else {
					setOptions([]);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setSearchTermArray([]);
			}
		}

		if (authState?.token) {
			updateOptions();
		}
	}, [filter, authState]);

	const handleSearch = async () => {
		try {
			let response;

			if (filter[0] === 0) {
				// Buscar por nombre
				response = await api.recipes.searchByName(authState?.token, searchTerm);
			} else if (filter[0] === 1) {
				// Buscar por ingrediente
				response = await api.recipes.searchByIngredients(
					authState?.token,
					searchTermArray,
				);
			} else if (filter[0] === 2) {
				// Buscar por tags
				response = await api.recipes.searchByTags(
					authState?.token,
					searchTermArray,
				);
			} else if (filter[0] === 3) {
				response = await api.recipes.searchByWithoutIngredients(
					authState?.token,
					searchTermArray,
				);
			}

			if (response?.isSuccess) {
				setItems(response.recipes); // Actualizar los items con los datos recibidos
			} else {
				console.error("Error en la búsqueda:", response?.error);
			}
		} catch (error) {
			console.error("Error en el proceso de búsqueda:", error);
		}
	};

	async function toggleFavorite(id: number) {
		const updatedItems = items.map((item) => {
			if (item.id === id) {
				return { ...item, saved: !item.saved };
			}
			return item;
		});

		setItems(updatedItems);

		const targetItem = updatedItems.find((item) => item.id === id);

		try {
			if (targetItem?.saved) {
				const response = await api.savedRecipes.add(authState?.token, id);
				if (!response.isSuccess) {
					throw new Error(response.error || "Error al guardar la receta.");
				}
			} else {
				const response = await api.savedRecipes.delete(authState?.token, id);
				if (!response.isSuccess) {
					throw new Error(response.error || "Error al eliminar la receta.");
				}
			}
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
		<SafeAreaView className="bg-primary flex-1 py-6 px-4">
			<View>
				<View className="flex flex-row items-center mt-8">
					{filter[0] === 0 ? (
						<View className="flex-1">
							<FormField
								title=""
								placeholder="Buscar recetas por nombre..."
								type="text"
								value={searchTerm}
								handleChangeText={setSearchTerm}
							/>
						</View>
					) : (
						<View className="flex-1">
							<MultiSelect
								items={options}
								value={searchTermArray}
								// @ts-ignore
								onChange={setSearchTermArray}
								selectText="Select..."
								searchPlaceholderText="Search..."
								uniqueKey="id"
								otherStyles="mt-0"
							/>
						</View>
					)}
					<TouchableOpacity
						className="h-12 bg-secondary-dark rounded-md flex ml-1 p-2"
						activeOpacity={0.7}
						onPress={handleSearch}
					>
						<TabBarIcon size={30} name={"search"} color={"white"} />
					</TouchableOpacity>
				</View>
				<MultiSelect
					items={filters}
					value={filter}
					onChange={setFilter}
					selectText="Select the filter type"
					searchPlaceholderText="Search by..."
					uniqueKey="id"
					single={true}
				/>
			</View>
			<ScrollView className="gap-y-4 w-full mx-auto mt-2 px-2">
				{items?.length <= 0 || !items ? <Text>Sin Resultados</Text> : null}
				{items.map((item) => (
					<Card key={item.id} item={item} toggleFavorite={toggleFavorite} />
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default Search;
