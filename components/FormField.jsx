import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
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

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-brand font-pmedium">{title}</Text>

      <View className={`w-full h-14 px-4 bg-offwhite rounded-md border-2 ${!error ? "border-black-200" : "border-red-500"} focus:border-brand flex flex-row items-center`}>
        <TextInput
          className="flex-1 text-offblack font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={type === "password" && !showPassword}
          {...props}
        />

        {type === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-red-500 font-bold">{error.message}</Text>}

    </View>
  );
};

export default FormField;
