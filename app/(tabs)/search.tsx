import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';

import FormField from '@/components/FormField';
import { images } from '@/constants';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { router } from 'expo-router';

const data = [
  { id: 1, image: images.moro, saved: true, title: 'Moro de Guandules', content: 'This is the content of card 1' },
  { id: 2, image: images.rice, saved: false, title: 'Arroz con Pollo', content: 'This is the content of card 2' },
  { id: 3, image: images.meat, saved: false, title: 'Carne Asada', content: 'This is the content of card 3' },

  { id: 4, image: images.moro, saved: true, title: 'Moro de Guandules', content: 'This is the content of card 1' },
  { id: 5, image: images.rice, saved: false, title: 'Arroz con Pollo', content: 'This is the content of card 2' },
  { id: 6, image: images.meat, saved: true, title: 'Carne Asada', content: 'This is the content of card 3' },
  // ... más elementos
];

const Search = () => {
  const [items, setItems] = useState(data)
  const [searchTerm, setSearchTerm] = useState('');

  function toggleFavorite(id: number) {
    const newData = items.map(item => {
      if (item.id == id) {
        return { ...item, saved: !item.saved }
      }
      return item
    })

    setItems(newData)
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView className='bg-primary flex-1 py-6 px-4' >
      <FormField
        title=""
        placeholder="Buscar recetas..."
        type="text"
        value={searchTerm}
        handleChangeText={setSearchTerm}
      />
      <ScrollView className='gap-y-4 w-full mx-auto mt-1 px-2'>
        {filteredItems.map(item => (
          <View key={item.id} className='flex-row bg-offwhite p-4 rounded-md border border-gray-300'>
            <View className='self-center'>
              <Image className="rounded-md h-24 w-24" source={item.image} resizeMode="cover" />
            </View>

            <View className='px-2'>
              <Text className='text-md font-inter-medium' onPress={() => router.push("/(tabs)/recipe")}>{item.title}</Text>
              <View className='gap-2 flex-row'>
                <Text className='text-xs text-brand'>@ArdelisUlloa</Text>
                <Text className='text-xs'>100k Likes</Text>
              </View>
              <View className='flex-row'>
                <Text className='text-xs flex-1' numberOfLines={4}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco </Text>
              </View>
            </View>

            <View className='ml-auto'>
              <TabBarIcon className='p-1' size={30} name={item?.saved ? "heart" : 'heart-outline'} color={"red"} onPress={() => toggleFavorite(item.id)} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
