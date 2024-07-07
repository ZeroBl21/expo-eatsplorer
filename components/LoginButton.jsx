import { ActivityIndicator, Text, Image, TouchableOpacity } from "react-native";

import { icons } from '@/constants';

function LoginButton({
  title, handlePress, containerStyles, textStyles, isLoading, icon, ...props
}) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-offwhite w-16 h-16 rounded-full border-2 border-gray-400 flex flex-row justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
      {...props}
    >
      <Image className="w-14 h-14 self-center" source={icon} resizeMode="contain" />
      <Text className="sr-only">{title}</Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2" />
      )}
    </TouchableOpacity>
  );
}

export default LoginButton;
