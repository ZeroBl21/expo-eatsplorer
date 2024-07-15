import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

import { useAuth } from '../../context/auth-context';
import Button from '@components/Button';

export default function Home() {
  const { authState, handleLogout } = useAuth();
  return (
    <View className="flex-1 items-center justify-center bg-[#f8dcac]">
      <Text>Token {authState?.token} </Text>
      <Button title="Log out" handlePress={handleLogout} />
      <StatusBar style="auto" />
    </View>
  );
}
