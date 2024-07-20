import React, { useState, useEffect } from 'react';
import { Link, router } from "expo-router";
import { View, ScrollView, Image, SafeAreaView, Text, Alert, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { promptOauth, handleLogin, request } = useAuth();

  useEffect(() => {
    checkForBiometrics();
  }, []);

  async function checkForBiometrics() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert('Error', 'Este dispositivo no soporta la autenticación biométrica');
    }
  }

  async function handleBiometricAuth() {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return Alert.alert('Error', 'No hay biometría guardada en este dispositivo');
    }

    const { success } = await LocalAuthentication.authenticateAsync();
    if (success) {
      // Aquí puedes manejar el login automáticamente si la autenticación biométrica es exitosa
      handleBiometricLogin();
    } else {
      Alert.alert('Error', 'Autenticación biométrica fallida');
    }
  }

  async function handleBiometricLogin() {
    setIsSubmitting(true);
    try {
      // Reemplaza estas credenciales de ejemplo por las reales guardadas en el dispositivo
      const email = 'example@mail.com';
      const password = 'password123';
      const isSuccess = await handleLogin!(email, password);
      if (!isSuccess) {
        Alert.alert('Error', 'Credenciales inválidas');
        return;
      }

      router.replace("/home");
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submit() {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const isSuccess = await handleLogin!(form.email, form.password);
      if (!isSuccess) {
        Alert.alert("Error", "Invalid Credentials");
        return;
      }

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
        <View className="w-full justify-center min-h-[95vh] px-6 ">
          <Image className="w-[250px] h-[250px] mt-8 self-center ml-[25%]" source={images.logo} resizeMode="contain" />
          <Text className="text-4xl font-medium text-brand font-psemibold text-center my-2">Login</Text>
          <View className="p-2 flex flex-row justify-evenly items-center">
            <LoginButton title="Login with GitHub" icon={icons.github} isLoading={!request} handlePress={() => promptOauth()} />
            <LoginButton title="Login with Facebook" icon={icons.facebook} isLoading={!request} handlePress={() => promptOauth()} />
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
            type="password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <View className="flex justify-center pt-5 flex-row gap-2 align-center mt-7 mx-2">
            <Button
              title="Log In"
              handlePress={submit}
              containerStyles="flex-1 self-center min-h-[62px]"
              textStyles="text-lg"
              isLoading={isSubmitting}
            />
            <TouchableOpacity onPress={handleBiometricAuth} className="ml-2">
              <Image source={icons.fingerprint} style={{ width: 48, height: 48 }} resizeMode="contain" />
            </TouchableOpacity>
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
