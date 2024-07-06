import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-[#f8dcac]">
      <Text>Open up App.js to start working on your app!</Text>
      <Link className='p-5 text-blue-500 font-bold' href="/login">Login</Link>
      <Link className='p-5 text-blue-500 font-bold' href="/register">Register</Link>
      <StatusBar style="auto" />
    </View>
  );
}
