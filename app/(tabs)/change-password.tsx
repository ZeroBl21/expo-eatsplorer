import React, { useState } from 'react';
import { View, ScrollView, Image, SafeAreaView, Text, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { images } from '@/constants';
import FormField from '@components/FormField';
import Button from '@components/Button';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import api from '@/api/db';


export default function ChangePassword() {
  const { authState } = useAuth()
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      passwordConfirm: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(data: any) {
    const { currentPassword, newPassword, passwordConfirm } = data;

    if (newPassword !== passwordConfirm) {
      setError('passwordConfirm', {
        type: 'manual',
        message: 'Password and Confirm Password are not the same'
      });

      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.users.changePassword(currentPassword, newPassword, authState?.token)
      if (!res.isSuccess) {
        Alert.alert("Error", "Cannot change password");
        return
      }

      router.replace("/(tabs)/home");
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
          <Text className="text-3xl text-brand font-inter-semibold text-center mb-8">Change Password</Text>

          <Controller
            control={control}
            name="currentPassword"
            rules={{ required: 'Please enter your password' }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Current Password"
                placeholder="Enter your current password..."
                type="password"
                value={value}
                handleChangeText={onChange}
                otherStyles="mt-4"
                error={errors.currentPassword}
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters long' }
            }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Password"
                placeholder="Enter your new password..."
                type="password"
                value={value}
                handleChangeText={onChange}
                otherStyles="mt-2"
                error={errors.newPassword}
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            rules={{ required: 'Please confirm your password' }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Password Confirm"
                placeholder="Confirm your password..."
                type="password"
                value={value}
                handleChangeText={onChange}
                otherStyles="mt-4"
                error={errors.passwordConfirm}
              />
            )}
          />

          <Button
            title="Update Password"
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
