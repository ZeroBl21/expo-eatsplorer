import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';

import FormField from '@/components/FormField';
import { icons, images } from '@/constants';
import LoginButton from '@/components/LoginButton';

const data = [
  { id: 1, image: images.moro, title: 'Moro de Guandules', content: 'This is the content of card 1' },
  { id: 2, image: images.rice, title: 'Arroz con Pollo', content: 'This is the content of card 2' },
  { id: 3, image: images.meat, title: 'Carne Asada', content: 'This is the content of card 3' },

  { id: 4, image: images.moro, title: 'Moro de Guandules', content: 'This is the content of card 1' },
  { id: 5, image: images.rice, title: 'Arroz con Pollo', content: 'This is the content of card 2' },
  { id: 6, image: images.meat, title: 'Carne Asada', content: 'This is the content of card 3' },
  // ... más elementos
];

const App = () => {
  return (
    <SafeAreaView className='bg-primary flex-1 p-6' >
      <FormField
        placeholder="Buscar recetas..."
      />
      <ScrollView className='gap-y-4 w-full mx-auto mt-1'>
        {data.map(item => (
          <View className='flex-row bg-offwhite p-4 rounded-md'>
            <View className='self-center'>
              <Image className="rounded-md h-24 w-24" source={item.image} resizeMode="cover" />
            </View>

            <View className='px-2'>
              <Text className='text-md font-inter-medium'>{item.title}</Text>
              <View className='gap-2 flex-row'>
                <Text className='text-xs text-brand'>@ArdelisUlloa</Text>
                <Text className='text-xs'>100k Likes</Text>
              </View>
              <View className='flex-row'>
                <Text className='text-xs flex-1'numberOfLines={4}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco </Text>
              </View>
            </View>

            <View className='ml-auto'>
              <LoginButton title="Login with GitHub" icon={icons.plus} containerStyles="h-10 w-10 border-brand" />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
