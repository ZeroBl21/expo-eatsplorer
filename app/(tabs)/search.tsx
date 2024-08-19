import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, Image } from "react-native";

import FormField from "@/components/FormField";
import { images } from "@/constants";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { router } from "expo-router";
import { useAuth } from "@/context/auth-context";
import MultiSelect from "@/components/MultiSelect";
import api from "@/api/db";

const randomImage = [images.moro, images.meat, images.rice];

function Card({ item, toggleFavorite }) {
	return (
		<View className="flex-row bg-offwhite mt-2 p-4 rounded-md border border-gray-300">
			<View className="self-center">
				<Image
					className="rounded-md h-24 w-24"
					source={randomImage[(item.id + 1) % 3]}
					resizeMode="cover"
				/>
			</View>

			<View className="px-2">
				<View className="flex-row">
					<Text
						className="text-sm flex-[60%] font-inter-medium"
						onPress={() => router.push("/(tabs)/recipe")}
						numberOfLines={2}
					>
						{item.title}
					</Text>
				</View>
				<View className="gap-2 flex-row">
					<Text className="text-xs text-brand">@ArdelisUlloa</Text>
					<Text className="text-xs">{item.likes} Likes</Text>
				</View>
				<View className="flex-row">
					<Text className="text-xs flex-1" numberOfLines={4}>
						{item.description}
					</Text>
				</View>
			</View>

			<View className="ml-auto">
				<TabBarIcon
					className="p-1"
					size={30}
					name={item?.saved ? "heart" : "heart-outline"}
					color={"red"}
					onPress={() => toggleFavorite(item.id)}
				/>
			</View>
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
	},
	{
		id: 2,
		image: images.rice,
		saved: false,
		title: "Arroz con Pollo",
		description: "This is the content of card 2",
	},
	{
		id: 3,
		image: images.meat,
		saved: false,
		title: "Carne Asada",
		description: "This is the content of card 3",
	},
	{
		id: 4,
		image: images.moro,
		saved: true,
		title: "Moro de Guandules",
		description: "This is the content of card 1",
	},
	{
		id: 5,
		image: images.rice,
		saved: false,
		title: "Arroz con Pollo",
		description: "This is the content of card 2",
	},
	{
		id: 6,
		image: images.meat,
		saved: true,
		title: "Carne Asada",
		description: "This is the content of card 3",
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
				console.log(searchTermArray);
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

	function toggleFavorite(id: number) {
		const newData = items.map((item) => {
			if (item.id === id) {
				return { ...item, saved: !item.saved };
			}
			return item;
		});

		setItems(newData);
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
					<View className="h-12 bg-secondary-dark rounded-md flex ml-1 p-2">
						<TabBarIcon
							size={30}
							name={"search"}
							color={"white"}
							onPress={handleSearch}
						/>
					</View>
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
