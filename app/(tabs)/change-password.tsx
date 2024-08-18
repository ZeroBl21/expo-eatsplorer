import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	Alert,
	ImageBackground,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";

import api from "@/api/db";
import { images } from "@/constants";
import { useAuth } from "@/context/auth-context";
import Button from "@components/Button";
import FormField from "@components/FormField";
import { router } from "expo-router";

export default function ChangePassword() {
	const { authState } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			passwordConfirm: "",
		},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function submit(data: any) {
		const { currentPassword, newPassword, passwordConfirm } = data;

		if (newPassword !== passwordConfirm) {
			setError("passwordConfirm", {
				type: "manual",
				message: "Password and Confirm Password are not the same",
			});

			return;
		}

		setIsSubmitting(true);
		try {
			const res = await api.users.changePassword(
				currentPassword,
				newPassword,
				authState?.token,
			);
			if (!res.isSuccess) {
				Alert.alert("Error", "Cannot change password");
				return;
			}

			router.replace("/(tabs)/home");
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<ImageBackground
			className="bg-primary h-full pb-4"
			source={images.background}
			resizeMode="cover"
			imageStyle={{ opacity: 0.2 }}
		>
			<SafeAreaView>
				<ScrollView className="px-6">
					<View className="w-full justify-center min-h-[95vh]">
						<Text className="text-3xl text-brand font-inter-semibold text-center mb-8">
							Change Password
						</Text>

						<Controller
							control={control}
							name="currentPassword"
							rules={{ required: "Please enter your password" }}
							render={({ field: { onChange, value } }) => (
								<FormField
									title="Current Password"
									placeholder="Enter your current password..."
									type="password"
									value={value}
									handleChangeText={onChange}
									otherStyles="mt-4"
									error={errors.currentPassword}
								/>
							)}
						/>

						<Controller
							control={control}
							name="newPassword"
							rules={{
								required: "Password is required",
								minLength: {
									value: 8,
									message: "Password must be at least 8 characters long",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<FormField
									title="Password"
									placeholder="Enter your new password..."
									type="password"
									value={value}
									handleChangeText={onChange}
									otherStyles="mt-2"
									error={errors.newPassword}
								/>
							)}
						/>

						<Controller
							control={control}
							name="passwordConfirm"
							rules={{ required: "Please confirm your password" }}
							render={({ field: { onChange, value } }) => (
								<FormField
									title="Password Confirm"
									placeholder="Confirm your password..."
									type="password"
									value={value}
									handleChangeText={onChange}
									otherStyles="mt-4"
									error={errors.passwordConfirm}
								/>
							)}
						/>

						<Button
							title="Update Password"
							handlePress={handleSubmit(submit)}
							containerStyles="mt-6 min-h-[62px]"
							textStyles="text-lg"
							isLoading={isSubmitting}
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
		</ImageBackground>
	);
}
