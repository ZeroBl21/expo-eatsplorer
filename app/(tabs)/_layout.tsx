import React from "react";
import { Tabs, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "../../context/auth-context";

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const { authState, request } = useAuth();

	if (!authState?.token && request) return <Redirect href="/login" />;

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						tabBarIcon: ({ color, focused }) => (
							<TabBarIcon
								name={focused ? "home" : "home-outline"}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="search"
					options={{
						title: "Search",
						tabBarIcon: ({ color, focused }) => (
							<TabBarIcon
								name={focused ? "search" : "search-outline"}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="shelf"
					options={{
						title: "Shelf",
						tabBarIcon: ({ color, focused }) => (
							<TabBarIcon
								name={focused ? "menu" : "menu-outline"}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						tabBarIcon: ({ color, focused }) => (
							<TabBarIcon
								name={focused ? "person" : "person-outline"}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="upload-recipe"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="edit-profile"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="change-password"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="favorites"
					options={{
						href: null,
					}}
				/>
			</Tabs>
			<StatusBar backgroundColor="#161622" style="light" />
		</>
	);
}
