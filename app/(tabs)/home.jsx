import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

import { useAuth } from '../../context/auth-context';
import Button from '@components/Button';

export default function Home() {
  const { user, handleLogout } = useAuth();
  console.log(user)
  return (
    <View className="flex-1 items-center justify-center bg-[#f8dcac]">
      <Text>Bienvenido {user.user} a la aplicación! {user?.email ?? "No"}</Text>
      <Button title="Log out" handlePress={handleLogout} />
      <StatusBar style="auto" />
    </View>
  );
}
