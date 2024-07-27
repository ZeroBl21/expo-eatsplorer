import React, { useState } from 'react';
import { View, ScrollView, Image, SafeAreaView, Text, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { images } from '@/constants';
import FormField from '@components/FormField';
import Button from '@components/Button';
import MultiSelect from '@/components/MultiSelect';


const food = [
  { id: '1', name: 'Bananas' },
  { id: '2', name: 'Manzanas' },
  { id: '3', name: 'Calabazas' },
  { id: '4', name: 'Frutos Secos' },
  { id: '5', name: 'Brocoli' }
];

const foodAllergies = [
  { id: '1', name: 'Mani' },
  { id: '2', name: 'Frutos secos' },
  { id: '3', name: 'Leche' },
  { id: '4', name: 'Huevo' },
  { id: '5', name: 'Pescado' },
];

export default function EditProfile() {
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      username: '',
      email: '',
      description: '',
      likes: [],
      dislikes: [],
      alergic: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(data: any) {
  }

  return (
    <SafeAreaView className="bg-primary h-full pb-4">
      <ScrollView>
        <View className="w-full justify-center min-h-[95vh] px-6">
          <Image className="w-[250px] h-[250px] mt-8 self-center ml-[25%]" source={images.logo} resizeMode="contain" />
          <Text className="text-3xl text-brand font-inter-semibold text-center">Edit Profile</Text>

          <Controller
            control={control}
            name="username"
            rules={{ required: 'Username is required' }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Username"
                type="text"
                placeholder="JohnDoe"
                value={value}
                handleChangeText={onChange}
                otherStyles="mt-4"
                error={errors.username}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Email"
                type="email"
                placeholder="example@mail.com"
                value={value}
                handleChangeText={onChange}
                otherStyles="mt-2"
                keyboardType="email-address"
                error={errors.email}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            rules={{
              minLength: { value: 8, message: 'Description must be at least 8 characters long' },
              maxLength: { value: 255, message: 'Your profile description is too long. Please shorten it to 255 characters or less.' }
            }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Description"
                placeholder="Enter your description..."
                type="textarea"
                value={value}
                handleChangeText={onChange}
                otherStyles="mt-2"
                error={errors.description}
              />
            )}
          />

          <Controller
            control={control}
            name="likes"
            render={({ field: { onChange, value } }) => (
              <MultiSelect
                items={food}
                value={value}
                onChange={onChange}
                selectText="Select your favorites"
                searchPlaceholderText='Hmm I like...'
                uniqueKey="id"
              />
            )}
          />

          <Controller
            control={control}
            name="dislikes"
            render={({ field: { onChange, value } }) => (
              <MultiSelect
                items={food}
                value={value}
                onChange={onChange}
                selectText="Select your dislikes"
                searchPlaceholderText="Hmm I don't like..."
                uniqueKey="id"
              />
            )}
          />

          <Controller
            control={control}
            name="alergic"
            render={({ field: { onChange, value } }) => (
              <MultiSelect
                items={foodAllergies}
                value={value}
                onChange={onChange}
                selectText="Select Allergies"
                searchPlaceholderText="Hmm I'm alergic to..."
                uniqueKey="id"
              />
            )}
          />

          <Button
            title="Update Profile"
            handlePress={handleSubmit(submit)}
            containerStyles="mt-6 min-h-[62px]"
            textStyles="text-lg"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
