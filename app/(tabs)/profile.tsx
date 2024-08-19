import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Image,
	ImageBackground,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";

import Button from "@/components/Button";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/auth-context";

import api from "@/api/db";
import { icons, images } from "@/constants";

type User = {
	id: number | undefined;
	username: string | undefined;
	description: string | undefined;
	recipesCount: number | undefined;
	profileImage: string | undefined;
	thumbnailImage: string | undefined;
	likes: any[] | undefined;
	dislikes: any[] | undefined;
	alergic: any[] | undefined;
};

export default function Profile() {
	const [user, setUser] = useState<User>();
	const { authState } = useAuth();

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await api.users.findById(
					authState?.userId,
					authState?.token ?? 4,
				);
				if (!res.isSuccess) return;
				console.log(res.user);

				setUser(res.user as User);
			} catch (error) {
				console.error(error);
			}
		}

		if (authState?.userId) {
			fetchUser();
		}
	}, [authState]);

	return (
		<SafeAreaView className="flex-1 bg-offwhite">
			<ScrollView>
				<ImageBackground
					className="z-20 flow-row pt-[20vh]"
					source={
						user?.thumbnailImage
							? { uri: user?.thumbnailImage }
							: images.thumbnail
					}
				>
					<Image
						className="h-32 w-32 p-4 rounded-full relative top-4"
						source={
							user?.profileImage ? { uri: user?.profileImage } : images.profile
						}
						resizeMode="contain"
					/>
				</ImageBackground>

				<View className="bg-offwhite p-4 border-b-4 border-secondary gap-4">
					<Text className="text-xl text-secondary-dark font-inter-medium">
						@{user?.username ?? "Loading..."}
					</Text>
					<Text className="text-pretty text-xs font-inter-regular">
						<Text className="font-inter-bold">{user?.recipesCount ?? 0}</Text>{" "}
						Recetas Guardadas
					</Text>
					<Text className="text-xs font-inter-regular">
						{user?.description ??
							"Me gusta cocinar, pero no soy creativa ni tengo tanto dominio, asi que busco recetas increibles que me motiven a seguir aprendiendo y disfrutar de la cocina"}
					</Text>
					<View className="flex-row pt-2 gap-2 justify-around items-center">
						<Button
							title="Subir Receta"
							icon={icons.plus2}
							containerStyles="border-0 py-1"
							handlePress={() => router.replace("/upload-recipe")}
						/>
						<Button
							title="Editar Perfil"
							icon={icons.pencil}
							containerStyles="border-0"
							handlePress={() => router.replace("/(tabs)/edit-profile")}
						/>
						<View className="bg-secondary-dark p-1 mb-2 rounded-md">
							<TabBarIcon
								className="p-[2px]"
								size={18}
								name={"cog"}
								color={"white"}
								onPress={() => router.replace("/(tabs)/change-password")}
							/>
						</View>
					</View>
				</View>
				<View className="flex-row bg-offwhite justify-around p-4">
					<Button
						title="Recetas"
						icon={icons.chef}
						containerStyles="border-0"
						handlePress={() => router.replace("/(tabs)/search")}
					/>
					<Button
						title="Guardadas"
						icon={icons.recent}
						containerStyles="border-0"
						handlePress={() => router.replace("/(tabs)/favorites")}
					/>
				</View>
				<View className="bg-offwhite h-full p-4 py-6 space-y-2">
					<Text className="font-bold">Detalles:</Text>
					{user?.likes?.length ? (
						<Text className="font-inter-regular">
							☺ Me gustan las {user.likes.map((item) => item.name).join(", ")}
						</Text>
					) : null}

					{user?.dislikes?.length ? (
						<Text className="font-inter-regular">
							😥 No consumo {user.dislikes.map((item) => item.name).join(", ")}
						</Text>
					) : null}

					{user?.alergic?.length ? (
						<Text className="font-inter-regular">
							🤒 Alergica al {user.alergic.map((item) => item.name).join(", ")}
						</Text>
					) : null}

					<View className="items-end p-2">
						<Image
							className="border-2 h-16 w-32"
							source={images.bread}
							resizeMode="contain"
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
