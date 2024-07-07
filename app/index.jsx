// app/(tabs)/index.jsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { images } from '../constants';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import Button from '@components/Button';
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function SplashScreen() {
  const router = useRouter();

  return (
    <StyledView className="flex-1 justify-center items-center bg-[#FADDAF]">
      <Image className="w-[250px] h-[250px] mt-8 self-center ml-[25%]" source={images.logo} resizeMode="contain" />
      <StyledText className="text-4xl font-bold mb-4">Eatsplorer</StyledText>
      <StyledText className="text-xl mb-6">De tu despensa a tu mesa</StyledText>
      <Button
        title="Empezar"
        handlePress={() => router.push('(auth)/login')}
        containerStyles="bg-[#f5a623] py-3 px-6 rounded-lg"
      />
      <StatusBar style="auto" />
    </StyledView>
  );
}