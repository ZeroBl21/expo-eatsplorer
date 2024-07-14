import React, { useState } from 'react';
import { Link, router } from "expo-router";
import { View, ScrollView, Image, SafeAreaView, Text, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { images } from '../../constants';
import FormField from '@components/FormField';
import Button from '@components/Button';
import { useAuth } from '../../context/auth-context';
import api from '../../api/db';

export default function Register() {
  const { user, setUser, setAuthToken } = useAuth();
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      username: user?.user || '',
      email: user?.email || '',
      password: '',
      passwordConfirm: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(data) {
    const { username, email, password, passwordConfirm } = data;

    if (password !== passwordConfirm) {
      setError('passwordConfirm', { type: 'manual', message: 'Password and Confirm Password are not the same' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.users.register({ username, email, password });
      if (!result.isSuccess) {
        Alert.alert("Error", "Cannot register");
        return;
      }
      setUser({ user: result?.user, email });
      setAuthToken(result.token);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[95vh] px-6">
          <Image className="w-[250px] h-[250px] mt-8 self-center ml-[25%]" source={images.logo} resizeMode="contain" />
          <Text className="text-4xl font-medium text-brand font-psemibold text-center">Register</Text>

          <Controller
            control={control}
            name="username"
            rules={{ required: 'Username is required' }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Username"
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
            name="password"
            rules={{
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters long' }
            }}
            render={({ field: { onChange, value } }) => (
              <FormField
                title="Password"
                placeholder="Enter your password..."
                type="password"
                value={value}
                handleChangeText={onChange}
                otherStyles="mt-2"
                error={errors.password}
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
                otherStyles="mt-2"
                error={errors.passwordConfirm}
              />
            )}
          />

          <Button
            title="Register"
            handlePress={handleSubmit(submit)}
            containerStyles="mt-6"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-offblack font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/login"
              className="text-lg font-bold text-brand underline"
            >
              Login!
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
