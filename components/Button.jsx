import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

function Button({
  title, handlePress, containerStyles, textStyles, isLoading,
}) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-md border border-color min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      <Text className={`text-offwhite font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>

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
