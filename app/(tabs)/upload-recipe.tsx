import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styled } from 'nativewind';
import api from '../../api/db';
import { images } from '../../constants';
import { useAuth } from '../../context/auth-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

export default function UploadRecipe() {
  const { authState } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');

  const addIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredients([...ingredients, ingredientInput]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const submitRecipe = async () => {
    if (!authState.userId || !authState.token) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    const recipe = {
      title,
      description,
      instructions,
      photo: "ipzum lorem",  // Valor fijo para la imagen
      userId: authState.userId,
    };

    const recipeResponse = await api.recipes.uploadRecipe(recipe, authState.token);

    if (recipeResponse.isSuccess) {
      const recipeId = recipeResponse.data.id_receta;
      let ingredientIds = [];

      for (let i = 0; i < ingredients.length; i++) {
        const ingredient = { id_ingrediente: 0, nombre: ingredients[i] };
        const ingredientResponse = await api.recipes.uploadIngredient(ingredient, authState.token);
        
        if (ingredientResponse.isSuccess) {
          ingredientIds.push(ingredientResponse.data.id_ingrediente);
        } else {
          Alert.alert('Error', `Error uploading ingredient: ${ingredients[i]}`);
          return;
        }
      }

      const relationResponse = await api.recipes.relateIngredientsToRecipe(recipeId, ingredientIds, authState.token);

      if (relationResponse.isSuccess) {
        Alert.alert('Éxito', 'Receta y ingredientes subidos exitosamente');
      } else {
        Alert.alert('Error', 'Hubo un problema al relacionar los ingredientes con la receta');
      }
    } else {
      Alert.alert('Error', 'Hubo un problema al subir la receta');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <StyledScrollView className="bg-white h-full p-4">
        <StyledView className="items-center mt-12 mb-6">
          <StyledImage source={images.bread} className="w-24 h-24 mb-4 rounded-full" />
          <StyledText className="text-3xl font-bold text-yellow-600 mb-4">Subir Receta</StyledText>
        </StyledView>
        <StyledTextInput
          className="border border-gray-300 p-4 mb-4 rounded-lg"
          placeholder="Título"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
        <StyledTextInput
          className="border border-gray-300 p-4 mb-4 rounded-lg h-40"
          placeholder="Descripción"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />
        <StyledTextInput
          className="border border-gray-300 p-4 mb-4 rounded-lg h-40"
          placeholder="Instrucciones"
          placeholderTextColor="#888"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={5}
        />
        <StyledView className="flex flex-row mb-4">
          <StyledTextInput
            className="border border-gray-300 p-4 rounded-lg flex-1"
            placeholder="Ingrediente"
            placeholderTextColor="#888"
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
              <StyledView key={index} className="flex flex-row justify-between items-center mb-2">
                <StyledText className="text-base">{index + 1}. {ingredient}</StyledText>
                <StyledTouchableOpacity onPress={() => removeIngredient(index)}>
                  <StyledText className="text-red-500">Eliminar</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            ))}
          </StyledView>
        )}
        <StyledTouchableOpacity onPress={submitRecipe} className="bg-yellow-600 p-4 rounded-lg">
          <StyledText className="text-white text-center">Subir Receta</StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </KeyboardAvoidingView>
  );
}
