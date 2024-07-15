import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { styled } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';
import { icons, images } from '../../constants';
import api from '@/api/db';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

export default function UploadRecipe({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [photo, setPhoto] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.uri);
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredients([...ingredients, ingredientInput]);
      setIngredientInput('');
    }
  };

  const submitRecipe = async () => {
    const recipe = {
      title,
      description,
      instructions,
      photo,
      userId,
      ingredients: ingredients.map((ingredient, index) => ({ id: index + 1, name: ingredient })),
    };

    const response = await api.recipes.upload(recipe);

    if (response.isSuccess) {
      Alert.alert('Éxito', 'Receta subida exitosamente');
    } else {
      Alert.alert('Error', 'Hubo un problema al subir la receta');
    }
  };

  return (
    <StyledScrollView className="bg-white h-full p-4">
      <StyledView className="items-center mt-12 mb-6">
        <StyledImage source={images.bread} className="w-24 h-24 mb-4 rounded-full" />
        <StyledText className="text-3xl font-bold text-yellow-600 mb-4">Subir Receta</StyledText>
      </StyledView>
      <StyledTextInput
        className="border border-gray-300 p-4 mb-4 rounded-lg"
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <StyledTextInput
        className="border border-gray-300 p-4 mb-4 rounded-lg h-40" // Ajusta la altura
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3} // Aumenta el número de líneas
      />
      <StyledTextInput
        className="border border-gray-300 p-4 mb-4 rounded-lg h-40" // Ajusta la altura
        placeholder="Instrucciones"
        value={instructions}
        onChangeText={setInstructions}
        multiline
        numberOfLines={3} // Aumenta el número de líneas
      />
      <StyledView className="flex flex-row mb-4">
        <StyledTextInput
          className="border border-gray-300 p-4 rounded-lg flex-1"
          placeholder="Ingrediente"
          value={ingredientInput}
          onChangeText={setIngredientInput}
        />
        <StyledTouchableOpacity onPress={addIngredient} className="bg-yellow-500 p-4 ml-2 rounded-lg">
          <StyledText className="text-white">Añadir</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      {ingredients.length > 0 && (
        <StyledView className="mb-4">
          <StyledText className="text-xl font-bold mb-2">Ingredientes:</StyledText>
          {ingredients.map((ingredient, index) => (
            <StyledText key={index} className="text-base mb-1">{index + 1}. {ingredient}</StyledText>
          ))}
        </StyledView>
      )}
      <StyledTouchableOpacity onPress={pickImage} className="bg-yellow-500 p-4 mb-4 rounded-lg flex flex-row items-center justify-center">
        <StyledText className="text-white text-center mr-2">Seleccionar Foto</StyledText>
        <StyledImage source={icons.upload} className="w-6 h-6" />
      </StyledTouchableOpacity>
      {photo && <StyledImage source={{ uri: photo }} className="w-full h-56 mb-4 rounded-lg" />}
      <StyledTouchableOpacity onPress={submitRecipe} className="bg-yellow-600 p-4 rounded-lg">
        <StyledText className="text-white text-center">Subir Receta</StyledText>
      </StyledTouchableOpacity>
    </StyledScrollView>
  );
}
