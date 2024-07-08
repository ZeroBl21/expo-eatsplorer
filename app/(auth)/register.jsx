import React, { useState } from 'react';
import { Link, router } from "expo-router";
import { View, ScrollView, Image, SafeAreaView, Text } from 'react-native';
import { images } from '../../constants';
import FormField from '@components/FormField';
import Button from '@components/Button';
import { useAuth } from '../../context/auth-context';
import api from '../../api/db';

const initialState = {
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
}

export default function Register() {
  const { user, setUser, setToken } = useAuth()
  const [form, setForm] = useState(() => {
    if (user) {
      return {
        username: user.login,
        email: user.email,
        password: '',
        passwordConfirm: '',
      }
    }

    return initialState
  })

  const [isSubmitting, setIsSumitting] = useState(false)

  async function submit() {
    if (form.username === "" || form.email === "" || form.password === "" || form.passwordConfirm === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    if(form.password === form.passwordConfirm) {
      Alert.alert("Error", "Password and Confirm Password are not the same");
    }

    setIsSumitting(true);
    try {
      const result = await api.users.register({
        username: form.username,
        email: form.email,
        password: form.password
      });
      setUser(result.user);
      setToken(result.token);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSumitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[95vh] px-6">
          <Image className="w-[250px] h-[250px] mt-8 self-center ml-[25%]" source={images.logo} resizeMode="contain" />
          <Text className="text-4xl font-medium text-brand font-psemibold text-center">Register</Text>

          <FormField
            title="Username"
            placeholder="JohnDoe"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-4"
          />

          <FormField
            title="Email"
            placeholder="example@mail.com"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-2"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="Enter your password..."
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-2"
          />

          <FormField
            title="Password"
            placeholder="Confirm your password..."
            value={form.passwordConfirm}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-2"
          />

          <Button
            title="Register"
            handlePress={submit}
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

