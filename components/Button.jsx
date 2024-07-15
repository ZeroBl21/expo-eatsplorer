import { ActivityIndicator, Image, View, Text, TouchableOpacity } from "react-native";

function Button({
  title, handlePress, containerStyles, textStyles, isLoading, icon
}) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary-dark rounded-md border border-color flex flex-row justify-center items-center px-4 py-1 ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      <View className="flex-row gap items-center">
        {icon ? (
          <Image className="w-[20px] h-[20px] mr-1" source={icon} resizeMode="contain" />
        ) : null}
        <Text className={`text-offwhite font-psemibold justify-between ${textStyles}`}>
          {title}
        </Text>

      </View>

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

export default Button;
