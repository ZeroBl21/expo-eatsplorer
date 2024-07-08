import React, { useState } from 'react';
import { Link, router } from "expo-router";
import { View, ScrollView, Image, SafeAreaView, Text, Alert } from 'react-native';
import { images, icons } from '../../constants';
import FormField from '@components/FormField';
import Button from '@components/Button';
import LoginButton from '@components/LoginButton';
import { useAuth } from '../../context/auth-context';
import api from '../../api/db';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSumitting] = useState(false)
  const { authToken, setAuthToken, setUser, handleLogin, handleLogout, request } = useAuth();
  console.log(authToken)

  async function submit() {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return
    }

    setIsSumitting(true);
    try {
      const result = await api.users.login({
        email: form.email,
      }, form.password);
      console.log("result", result)
      if (!result.isSuccess) {
        Alert.alert("Error", "Invalid Credentials");
        return
      }
      setUser({
        user: result?.usuario,
        email: result?.correo,
      });
      setAuthToken(result.token);

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
        <View className="w-full justify-center min-h-[95vh] px-6 ">
          <Image className="w-[250px] h-[250px] mt-8 self-center ml-[25%]" source={images.logo} resizeMode="contain" />
          <Text className="text-4xl font-medium text-brand font-psemibold text-center my-2">Login</Text>
          <View className="p-2 flex flex-row justify-evenly items-center">
            {authToken ? (
              <>
                <Text>Access Token: {authToken}</Text>
                <Button title="Logout" handlePress={handleLogout} />
              </>
            ) : (
              <>
                <LoginButton title="Login with GitHub" icon={icons.github} isLoading={!request} handlePress={() => handleLogin()} />
                <LoginButton title="Login with Facebook" icon={icons.facebook} isLoading={!request} handlePress={() => handleLogin()} />
              </>
            )}
          </View>
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
            otherStyles="mt-7"
          />

          <View className="flex justify-center pt-5 flex-row gap-2 align-center mt-7 mx-2">
            <Button
              title="Log In"
              handlePress={submit}
              containerStyles="flex-1 self-center"
              isLoading={isSubmitting}
            />
            <Image className="flex-2 w-12 h-12 self-center" source={icons.fingerprint} resizeMode="contain" />
          </View>

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
