import React from 'react';
import { View, Text, SafeAreaView, Button, Image, ImageBackground } from 'react-native';


import { images } from '../../constants';
// import Button from '@/components/Button';


export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-primary">

      <ImageBackground className="z-20 flow-row pt-[20vh]" source={images.thumbnail}>
        <Image className="h-32 w-32 p-4 rounded-full relative top-4" source={images.profile} resizeMode="contain" />
      </ImageBackground>

      <View className="bg-offwhite p-4 border-b-4 border-secondary gap-4">
        <Text className="text-xl text-secondary font-medium">@ArdelisUlloa</Text>
        <Text className="text-pretty text-xs">
          <Text className="font-bold">10</Text> Recetas Guardadas
        </Text>
        <Text className="text-xs">Me gusta cocinar, pero no soy creativa ni tengo tanto dominio, asi que busco recetas increibles que me motiven a seguir aprendiendo y disfrutar de la cocina</Text>
        <View className="flex-row pt-2 gap-2 justify-around">
          <Button title="Subir Receta" />
          <Button title="Editar Perfil" />
        </View>
      </View>
      <View className="flex-row bg-offwhite justify-around p-4">
        <Button title="Recetas" />
        <Button title="Recientes" />
      </View>
      <View className="bg-offwhite h-full p-4 space-y-2">
        <Text className="font-bold">Detalles:</Text>
        <Text className="">☺ Me gustan las bananas</Text>
        <Text className="">😥 No consumo frutos secos</Text>
        <Text className="">🤒 Alergica al brocoli</Text>
        <View className="items-end p-2">
          <Image className="border-2 h-16 w-32" source={images.bread} resizeMode="contain" />
        </View>
      </View>
    </SafeAreaView>
  );
}

