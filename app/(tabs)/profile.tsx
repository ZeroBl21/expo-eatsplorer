import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, ImageBackground } from 'react-native';

import { icons, images } from '../../constants';
import Button from '@/components/Button';

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView>
        <ImageBackground className="z-20 flow-row pt-[20vh]" source={images.thumbnail}>
          <Image className="h-32 w-32 p-4 rounded-full relative top-4" source={images.profile} resizeMode="contain" />
        </ImageBackground>

        <View className="bg-offwhite p-4 border-b-4 border-secondary gap-4">
          <Text className="text-xl text-secondary-dark font-medium">@ArdelisUlloa</Text>
          <Text className="text-pretty text-xs">
            <Text className="font-bold">10</Text> Recetas Guardadas
          </Text>
          <Text className="text-xs">Me gusta cocinar, pero no soy creativa ni tengo tanto dominio, asi que busco recetas increibles que me motiven a seguir aprendiendo y disfrutar de la cocina</Text>
          <View className="flex-row pt-2 gap-2 justify-around">
            <Button
              title="Subir Receta"
              icon={icons.plus2}
              containerStyles="border-0 py-1"
            />
            <Button
              title="Editar Perfil"
              icon={icons.pencil}
              containerStyles="border-0"
            />
          </View>
        </View>
        <View className="flex-row bg-offwhite justify-around p-4">
          <Button
            title="Recetas"
            icon={icons.chef}
            containerStyles="border-0"
          />
          <Button
            title="Recientes"
            icon={icons.recent}
            containerStyles="border-0"
          />
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
      </ScrollView>
    </SafeAreaView>
  );
}

