import React, { useState } from 'react';
import { Link } from "expo-router";
import { View, ScrollView, Image, SafeAreaView, Text } from 'react-native';
import { images } from '../../constants';
import FormField from '@components/FormField';
import Button from '@components/Button';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSumitting] = useState(false)

  function submit() { }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[95vh] px-6 ">
          <Image className="w-[250px] h-[250px] mt-8 self-center ml-[25%]" source={images.logo} resizeMode="contain" />
          <Text className="text-4xl font-medium text-brand font-psemibold text-center">Login</Text>
          <FormField
            title="Email"
            placeholder="example@mail.com"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="Enter your password..."
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <Button
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-offblack font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/register"
              className="text-lg font-bold text-brand underline"
            >
              Register!
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

