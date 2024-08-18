import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	TextInputProps,
} from "react-native";

import { icons } from "@/constants";

type FormFieldProps = {
	title: string;
	value: string;
	type: "text" | "email" | "password" | "textarea";
	placeholder: string;
	handleChangeText: (text: string) => void;
	otherStyles?: string;
	error?: any;
} & TextInputProps;

const FormField: React.FC<FormFieldProps> = ({
	title,
	value,
	type,
	placeholder,
	handleChangeText,
	otherStyles,
	error,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const isPassword = type === "password";
	const isTextarea = type === "textarea";

	return (
		<View className={`space-y-2 ${otherStyles}`}>
			{title !== "" ? (
				<Text className="text-base text-brand font-inter-medium">{title}</Text>
			) : null}

			<View
				className={`w-full px-4 py-3 bg-offwhite rounded-md border focus:border-brand flex flex-row items-center
        ${error ? "border-red-500" : "border-gray-400"}`}
			>
				<TextInput
					className={`flex-1 ${
						isTextarea ? "min-h-[100px] align-text-top" : ""
					} text-offblack font-psemibold text-base`}
					value={value}
					placeholder={placeholder}
					placeholderTextColor="#7B7B8B"
					onChangeText={handleChangeText}
					secureTextEntry={isPassword && !showPassword}
					multiline={isTextarea}
					numberOfLines={isTextarea ? 10 : undefined}
					style={isTextarea ? { textAlignVertical: "top" } : null}
					{...props}
				/>

				{isPassword && (
					<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={showPassword ? icons.eyeHide : icons.eye}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
			</View>

			{error && (
				<Text className="text-red-500 font-inter-bold">{error.message}</Text>
			)}
		</View>
	);
};

export default FormField;
