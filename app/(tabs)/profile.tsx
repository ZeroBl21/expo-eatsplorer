import React, { useEffect, useState } from 'react';
import { router } from "expo-router";
import { View, Text, SafeAreaView, ScrollView, Image, ImageBackground } from 'react-native';

import { useAuth } from '@/context/auth-context';
import Button from '@/components/Button';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

import { icons, images } from '@/constants';
import api from '@/api/db';

type User = {
  id: number | undefined;
  username: string | undefined;
  description: string | undefined;
  recipesCount: number | undefined;
  profileImage: string | undefined;
  thumbnailImage: string | undefined;
  createdAt: string | undefined;
};

export default function Profile() {
  const [user, setUser] = useState<User>()
  const { authState } = useAuth()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.users.findById(authState?.userId, authState?.token ?? 4);
        if (!res.isSuccess) return

        setUser(res.user as User);
      } catch (error) {
        console.error(error);
      }
    };

    if (authState?.userId) {
      fetchUser();
    }
  }, [authState])

  return (
    <SafeAreaView className="flex-1 bg-offwhite">
      <ScrollView>
        <ImageBackground className="z-20 flow-row pt-[20vh]" source={user?.thumbnailImage ? { uri: user?.thumbnailImage } : images.thumbnail}>
          <Image className="h-32 w-32 p-4 rounded-full relative top-4" source={user?.profileImage ? { uri: user?.profileImage } : images.profile} resizeMode="contain" />
        </ImageBackground>

        <View className="bg-offwhite p-4 border-b-4 border-secondary gap-4">
          <Text className="text-xl text-secondary-dark font-inter-medium">{user?.username ?? "@ArdelisUlloa"}</Text>
          <Text className="text-pretty text-xs font-inter-regular">
            <Text className="font-inter-bold">{user?.recipesCount ?? 0}</Text> Recetas Guardadas
          </Text>
          <Text className="text-xs font-inter-regular">{user?.description ?? "Me gusta cocinar, pero no soy creativa ni tengo tanto dominio, asi que busco recetas increibles que me motiven a seguir aprendiendo y disfrutar de la cocina"}</Text>
          <View className="flex-row pt-2 gap-2 justify-around items-center">
            <Button
              title="Subir Receta"
              icon={icons.plus2}
              containerStyles="border-0 py-1"
              handlePress={() => router.replace("/upload-recipe")}
            />
            <Button
              title="Editar Perfil"
              icon={icons.pencil}
              containerStyles="border-0"
              handlePress={() => router.replace("/(tabs)/edit-profile")}
            />
            <View className="bg-secondary-dark p-1 mb-2 rounded-md">
              <TabBarIcon className='p-[2px]' size={18} name={'cog'} color={"white"} onPress={() => router.replace("/(tabs)/change-password")} />
            </View>
          </View>
        </View>
        <View className="flex-row bg-offwhite justify-around p-4">
          <Button
            title="Recetas"
            icon={icons.chef}
            containerStyles="border-0"
            handlePress={() => router.replace("/recipe")}
          />
          <Button
            title="Recientes"
            icon={icons.recent}
            containerStyles="border-0"
          />
        </View>
        <View className="bg-offwhite h-full p-4 py-6 space-y-2">
          <Text className="font-bold">Detalles:</Text>
          <Text className="font-inter-regular">☺ Me gustan las bananas</Text>
          <Text className="font-inter-regular">😥 No consumo frutos secos</Text>
          <Text className="font-inter-regular">🤒 Alergica al brocoli</Text>
          <View className="items-end p-2">
            <Image className="border-2 h-16 w-32" source={images.bread} resizeMode="contain" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

