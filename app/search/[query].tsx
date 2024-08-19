import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import api, { formatIngredients } from "@/api/db";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/auth-context";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { images } from "../../constants";

const markdownContent = `
### Título Principal

Este es un párrafo con *texto en cursiva* y **texto en negrita**.

- Elemento de lista 1
- Elemento de lista 2

### Preparar los guandules

Si usas guandules frescos o secos, cocínalos en agua con sal hasta que estén tiernos. Si usas guandules enlatados, escúrrelos y enjuágalos.

### Sofrito

En una olla grande, calienta 2 cucharadas de aceite a fuego medio.  
Agrega 1 cebolla picada, 1 pimiento verde picado, 1 pimiento rojo picado, 2 dientes de ajo picados y 1 ají cubanela picado (opcional).  
Sofríe hasta que las verduras estén tiernas y fragantes (5-7 minutos).

### Añadir condimentos

- Agrega 1 cucharadita de pasta de tomate,
- 1/2 cucharadita de orégano,
- 1/2 cucharadita de comino (opcional),
- 1/2 cucharadita de cilantro picado (opcional),
- 2 hojas de laurel,
- 1 cucharadita de vinagre,
- sal y pimienta al gusto.  
- Cocina por 2-3 minutos, removiendo constantemente.

### Añadir guandules

- Agrega 1 taza de guandules cocidos y mezcla bien.  
- Cocina por 2-3 minutos adicionales.

### Añadir arroz y líquido

Agrega 2 tazas de arroz y remueve bien.  
Añade 4 tazas de agua o caldo de pollo.  
Remueve bien y lleva a hervir.

### Cocinar

Una vez que hierva, reduce el fuego a medio-bajo y tapa la olla.  
Cocina por 20-25 minutos, o hasta que el líquido se haya absorbido y el arroz esté tierno. No destapes la olla durante este tiempo.

### Reposar

Apaga el fuego y deja reposar el moro tapado por 5-10 minutos.

### Servir

Remueve el moro con un tenedor para esponjar el arroz.  
Sirve caliente.
`;

type Recipe = {
	id: number;
	title: string;
	description: string;
	createdAt: string;
	image: string;
	ingredients: Ingredient[];
	instructions: string;
	likes: number;
	servings: number;
	userId: number;
	username: string;
};

type Ingredient = {
	id: number;
	name: string;
	quantity: string;
};

export default function Recipe() {
	const { authState } = useAuth();
	const { query } = useLocalSearchParams();

	const [recipe, setRecipe] = useState<Recipe>();
	const [loading, setLoading] = useState(true);
	const [availableIngredients, setAvailableIngredients] = useState<
		Ingredient[]
	>([]);

	useEffect(() => {
		async function searchRecipe() {
			const res = await api.recipes.searchByID(authState?.token, query);
			if (!res.isSuccess) {
				router.push("/search");
				return;
			}

			setRecipe(res.recipe as Recipe);
			setLoading(false);
		}

		async function fetchShelfIngredients() {
			const shelfRes = await api.pantry.list(authState?.token);
			if (!shelfRes.isSuccess) return;

			const formattedList = formatIngredients(shelfRes.pantryItems);
			setAvailableIngredients(formattedList as Ingredient[]);
		}

		if (authState?.token) {
			searchRecipe();
			fetchShelfIngredients();
		}
	}, [query, authState?.token]);

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-offwhite items-center justify-center">
				<ActivityIndicator size="large" color="#4C7031" />
			</SafeAreaView>
		);
	}

	function isIngredientMissing(ingredient: Ingredient): boolean {
		const availableIngredient = availableIngredients.find(
			(available) => available.id === ingredient.id,
		);
		if (!availableIngredient) {
			return true; // El ingrediente no está disponible
		}

		return availableIngredient.quantity < ingredient.quantity;
	}

	const hasMissingIngredients = recipe?.ingredients.some(isIngredientMissing);

	return (
		<SafeAreaView className="flex-1 bg-offwhite">
			<ScrollView>
				<View className="mt-10 h-[40vh] p-2">
					<Image
						className="h-full w-full rounded"
						source={recipe?.image ? { uri: recipe.image } : images.moro}
						resizeMode="cover"
					/>
				</View>
				<View className="py-4 px-3 flex-row justify-between">
					<View>
						<View className="flex-row">
							<Text
								className="text-xl font-inter-bold flex-[70%]"
								numberOfLines={2}
							>
								{recipe?.title}
							</Text>
						</View>

						<View className="flex-row gap-2 items-center">
							<Text className="text-sm font-inter-medium text-brand">
								@{recipe?.username ?? "Loading"}
							</Text>
							<Text className="text-xs font-inter-medium text-offblack">
								{`${recipe?.likes} Likes`}
							</Text>
						</View>
					</View>
					<TouchableOpacity activeOpacity={0.7} onPress={() => {}} className="">
						<TabBarIcon
							className="p-2 "
							size={30}
							name={"bookmark"}
							color={"red"}
						/>
					</TouchableOpacity>

					{!hasMissingIngredients ? (
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {}}
							className=""
						>
							<TabBarIcon
								className="p-2 "
								size={30}
								name={"fast-food"}
								color={"green"}
							/>
						</TouchableOpacity>
					) : null}
				</View>

				<View className="px-3">
					<View>
						<Text className="text-lg font-inter-medium py-2">
							Ingredientes{" "}
							{hasMissingIngredients ? (
								<Text className="text-red-500">(Faltan Ingredientes)</Text>
							) : null}
						</Text>
						<View>
							{recipe?.ingredients.map((ingredient) => (
								<Text
									key={ingredient.id}
									className={`font-inter-regular ${
										isIngredientMissing(ingredient) ? "text-red-500" : ""
									}`}
								>
									{`- ${ingredient.name} (${ingredient.quantity})`}
								</Text>
							))}
						</View>
					</View>

					<View className="pb-4">
						<Text className="text-lg font-inter-medium py-2">
							Instrucciones
						</Text>
						<View>
							{/* @ts-ignore */}
							<Markdown style={styles.markdown}>
								{recipe?.instructions ?? markdownContent}
							</Markdown>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	markdown: {
		// @ts-ignore
		text: {
			fontFamily: "Inter_400Regular",
		},
		heading1: {
			marginTop: 10,
			marginBottom: 2,
			fontSize: 24,
			fontFamily: "Inter_500Medium",
		},
		heading2: {
			marginTop: 10,
			marginBottom: 2,
			fontSize: 20,
			fontFamily: "Inter_500Medium",
		},
		heading3: {
			marginTop: 10,
			marginBottom: 2,
			fontSize: 20,
			fontFamily: "Inter_500Medium",
		},
		listItem: {
			fontSize: 16,
			color: "gray",
		},
		// Agrega más estilos según sea necesario
	},
});
