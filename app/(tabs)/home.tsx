import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { images, icons } from '../../constants';
import { useAuth } from '../../context/auth-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export default function Home() {
  const { handleLogout } = useAuth();

  return (
    <StyledView className="flex-1 bg-[#f8dcac]">
      <StyledScrollView className="flex-1 px-4">
        {/* Cabecera de Bienvenida */}
        <StyledView className="mt-12 mb-8">
          <StyledText className="text-4xl font-inter-bold text-center text-[#354d4e]">¡Bienvenido a Eatsplorer!</StyledText>
          <StyledText className="text-xl font-inter-medium text-center text-[#354d4e] mt-2">Descubre recetas deliciosas y más</StyledText>
        </StyledView>

        {/* Imagen Redondeada */}
        <StyledView className="items-center mb-10">
          <StyledImage source={images.bread} className="w-48 h-48 rounded-full shadow-lg bg-offwhite" resizeMode='contain' />
        </StyledView>

        {/* Secciones */}
        <StyledView className="mb-8">
          <StyledText className="text-2xl font-inter-semibold text-[#354d4e] mb-4">Explora Recetas</StyledText>
          <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
            <StyledTouchableOpacity className="bg-white p-4 rounded-lg shadow mr-4">
              <StyledImage source={icons.chef2} className="w-16 h-16 mb-2" />
              <StyledText className="text-lg font-inter-regular text-center text-[#354d4e]">Recetas Nuevas</StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity className="bg-white font-inter-regular p-4 rounded-lg shadow mr-4">
              <StyledImage source={icons.recent2} className="w-16 h-16 mb-2" />
              <StyledText className="text-lg text-center text-[#354d4e]">Recetas Populares</StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity className="bg-white font-inter-regular p-4 rounded-lg shadow">
              <StyledImage source={icons.bookmark2} className="w-16 h-16 mb-2" />
              <StyledText className="text-lg text-center text-[#354d4e]">Mis Favoritas</StyledText>
            </StyledTouchableOpacity>
          </StyledScrollView>
        </StyledView>

        {/* Botón de Logout */}
        <StyledTouchableOpacity onPress={handleLogout} className="bg-red-500  p-4 rounded-lg mb-8">
          <StyledText className="text-white text-center font-inter-regular text-lg">Log out</StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledView>
  );
}
