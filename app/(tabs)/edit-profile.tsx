import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, ScrollView, Image, SafeAreaView, Text, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { images } from '@/constants';
import FormField from '@components/FormField';
import Button from '@components/Button';
import MultiSelect from '@/components/MultiSelect';
import { useAuth } from '@/context/auth-context';
import api from '@/api/db';
import { router } from 'expo-router';


type User = {
  id: number;
  username: string;
  email: string;
  description: string;
  profileImage?: string;
  thumbnailImage?: string;
  likes: any[];
  dislikes: any[];
  alergic: any[];
};

export default function EditProfile() {
  const { authState } = useAuth()
  const [ingredients, setIngredients] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, reset, handleSubmit, formState: { errors }, setError } = useForm<User>({
    defaultValues: {
      username: '',
      email: '',
      description: '',
      likes: [],
      dislikes: [],
      alergic: []
    }
  });

  useLayoutEffect(() => {
    async function fetchUser() {
      try {
        const data = await api.users.findById(authState?.userId, authState?.token ?? 4);
        if (!data.isSuccess) return

        reset(data.user as User);
      } catch (error) {
        console.error(error);
      }
    };

    if (authState?.userId) {
      fetchUser();
    }
  }, [authState])

  useEffect(() => {
    async function fetchOptions() {
      const data = await api.ingredients.list(authState?.token);
      if (!data.isSuccess) return

      setIngredients(data.ingredients)
    }

    if (authState?.userId) {
      fetchOptions();
    }
  }, [authState])

  async function submit(data: any) {
    setIsSubmitting(true);
    try {
      const res = await api.users.update(data, authState?.token)
      if (!res.isSuccess) {
        Alert.alert("Error", "Cannot update user");
        return
      }

      router.replace("/(tabs)/profile");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
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
                items={ingredients}
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
                items={ingredients}
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
                items={ingredients}
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
