import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  const [porciones, setPorciones] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([]);  // Lista de ingredientes seleccionados con cantidades
  const [ingredientInput, setIngredientInput] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [predefinedIngredients, setPredefinedIngredients] = useState([]); // Lista de ingredientes predefinidos desde la API
  const [isValidIngredient, setIsValidIngredient] = useState(false); // Estado para validar el ingrediente
  const [ingredientQuantities, setIngredientQuantities] = useState({});  // Estado para manejar las cantidades de los ingredientes
  const [tags, setTags] = useState([]);  // Lista de tags seleccionados
  const [tagInput, setTagInput] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const [predefinedTags, setPredefinedTags] = useState([]); // Lista de tags predefinidos desde la API
  const [isValidTag, setIsValidTag] = useState(false); // Estado para validar el tag
  const [image, setImage] = useState(null);  // Estado para la imagen

  // Fetch the list of predefined ingredients and tags dynamically
  useEffect(() => {
    async function fetchIngredientsAndTags() {
      const ingredientsData = await api.ingredients.list(authState?.token);
      const tagsData = await api.tags.list(authState?.token);
      if (ingredientsData.isSuccess) {
        setPredefinedIngredients(ingredientsData.ingredients);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los ingredientes.');
      }

      if (tagsData.isSuccess) {
        setPredefinedTags(tagsData.tags);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los tags.');
      }
    }

    if (authState?.userId) {
      fetchIngredientsAndTags();
    }
  }, [authState]);

  const handleIngredientInputChange = (text) => {
    setIngredientInput(text);
    if (text.trim() !== '') {
      const filtered = predefinedIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredIngredients(filtered);
      setIsValidIngredient(filtered.some(ingredient => ingredient.name.toLowerCase() === text.toLowerCase())); // Valida si el ingrediente es exacto
    } else {
      setFilteredIngredients([]);
      setIsValidIngredient(false); // No hay ingrediente válido
    }
  };

  const addIngredient = () => {
    if (isValidIngredient && !ingredients.some(ing => ing.name === ingredientInput)) {
      const newIngredient = { name: ingredientInput, quantity: ingredientQuantities[ingredientInput] || 1 };
      setIngredients([...ingredients, newIngredient]);
      setIngredientInput('');
      setFilteredIngredients([]);
      setIsValidIngredient(false);
    } else {
      Alert.alert('Error', 'El ingrediente debe seleccionarse de la lista de autocompletado y no debe estar ya en la lista.');
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleTagInputChange = (text) => {
    setTagInput(text);
    if (text.trim() !== '') {
      const filtered = predefinedTags.filter(tag =>
        tag.name.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredTags(filtered);
      setIsValidTag(filtered.some(tag => tag.name.toLowerCase() === text.toLowerCase())); // Valida si el tag es exacto
    } else {
      setFilteredTags([]);
      setIsValidTag(false); // No hay tag válido
    }
  };

  const addTag = () => {
    if (isValidTag && !tags.some(tag => tag.name === tagInput)) {
      const newTag = { name: tagInput };
      setTags([...tags, newTag]);
      setTagInput('');
      setFilteredTags([]);
      setIsValidTag(false);
    } else {
      Alert.alert('Error', 'El tag debe seleccionarse de la lista de autocompletado y no debe estar ya en la lista.');
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tus fotos.');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);  // Guarda la URI de la imagen seleccionada
    }
  };

  const submitRecipe = async () => {
    if (!authState.userId || !authState.token) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    let imageUrl = null;

    if (image) {
      // Subir la imagen y obtener la URL
      const imageResponse = await api.recipes.uploadImage(image, authState.token);
      if (imageResponse.isSuccess) {
        imageUrl = imageResponse.url;
      } else {
        Alert.alert('Error', 'Hubo un problema al subir la imagen');
        return;
      }
    }

    const recipe = {
      title,
      description,
      instructions,
      photo: imageUrl,
      userId: authState.userId,
      fecha_creacion: new Date().toISOString(),
      porciones,
      likes: 0,
    };

    const recipeResponse = await api.recipes.uploadRecipe(recipe, authState.token);

    if (recipeResponse.isSuccess) {
      const recipeId = recipeResponse.data.id_receta;
      let ingredientsWithQuantities = [];

      for (let i = 0; i < ingredients.length; i++) {
        const ingredient = { id_ingrediente: 0, nombre: ingredients[i].name, medida: 'al gusto', dias_vencimiento: 0 };
        const ingredientResponse = await api.recipes.uploadIngredient(ingredient, authState.token);
        ingredientsWithQuantities.push({ ingredientId: ingredientResponse.data.ingrediente.id_ingrediente, quantity: ingredients[i].quantity });
      }

      const relationResponse = await api.recipes.relateIngredientsToRecipe(recipeId, ingredientsWithQuantities, authState.token);

      if (relationResponse.isSuccess) {
        let tagIds = [];

        for (let i = 0; i < tags.length; i++) {
          const tag = predefinedTags.find(t => t.name === tags[i].name);
          if (tag) tagIds.push(tag.id);
        }

        const tagRelationResponse = await api.recipes.relateTagsToRecipe(recipeId, tagIds, authState.token);

        if (tagRelationResponse.isSuccess) {
          Alert.alert('Éxito', 'Receta, ingredientes y tags subidos exitosamente');
        } else {
          Alert.alert('Error', 'Hubo un problema al relacionar los tags con la receta');
        }
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
          className="border border-gray-300 p-4 mb-4 rounded-lg"
          placeholder="Porciones"
          placeholderTextColor="#888"
          value={porciones}
          onChangeText={setPorciones}
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

        <StyledView className="mb-4">
          <StyledTextInput
            className="border border-gray-300 p-4 rounded-lg"
            placeholder="Ingrediente"
            placeholderTextColor="#888"
            value={ingredientInput}
            onChangeText={handleIngredientInputChange}
          />
          {/* Mostrar sugerencias de autocompletado */}
          {filteredIngredients.length > 0 && (
            <StyledView className="border border-gray-300 rounded-lg max-h-40 overflow-hidden">
              {filteredIngredients.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => {
                  setIngredientInput(item.name);
                  setIsValidIngredient(true); // Asegura que se active el botón
                }}>
                  <StyledText className="p-2 bg-gray-200 border-b border-gray-300">{item.name}</StyledText>
                </TouchableOpacity>
              ))}
            </StyledView>
          )}
        </StyledView>

        <StyledTextInput
          className="border border-gray-300 p-4 mb-4 rounded-lg"
          placeholder="Cantidad"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={ingredientQuantities[ingredientInput] || ''}
          onChangeText={(text) => setIngredientQuantities({ ...ingredientQuantities, [ingredientInput]: text })}
        />

        {ingredients.length > 0 && (
          <StyledView className="mb-4">
            <StyledText className="text-xl font-bold mb-2">Ingredientes:</StyledText>
            {ingredients.map((ingredient, index) => (
              <StyledView key={index} className="flex flex-row justify-between items-center mb-2">
                <StyledText className="text-base">{index + 1}. {ingredient.name} ({ingredient.quantity})</StyledText>
                <StyledTouchableOpacity onPress={() => removeIngredient(index)}>
                  <StyledText className="text-red-500">Eliminar</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            ))}
          </StyledView>
        )}

        <StyledTouchableOpacity
          onPress={addIngredient}
          className={`p-4 mb-4 rounded-lg ${isValidIngredient ? 'bg-yellow-600' : 'bg-gray-300'}`}
          disabled={!isValidIngredient} // Desactiva el botón si no es un ingrediente válido
        >
          <StyledText className="text-white text-center">Añadir Ingrediente</StyledText>
        </StyledTouchableOpacity>

        <StyledView className="mb-4">
          <StyledTextInput
            className="border border-gray-300 p-4 rounded-lg"
            placeholder="Tag"
            placeholderTextColor="#888"
            value={tagInput}
            onChangeText={handleTagInputChange}
          />
          {/* Mostrar sugerencias de autocompletado */}
          {filteredTags.length > 0 && (
            <StyledView className="border border-gray-300 rounded-lg max-h-40 overflow-hidden">
              {filteredTags.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => {
                  setTagInput(item.name);
                  setIsValidTag(true);
                }}>
                  <StyledText className="p-2 bg-gray-200 border-b border-gray-300">{item.name}</StyledText>
                </TouchableOpacity>
              ))}
            </StyledView>
          )}
        </StyledView>

        {tags.length > 0 && (
          <StyledView className="mb-4">
            <StyledText className="text-xl font-bold mb-2">Tags:</StyledText>
            {tags.map((tag, index) => (
              <StyledView key={index} className="flex flex-row justify-between items-center mb-2">
                <StyledText className="text-base">{index + 1}. {tag.name}</StyledText>
                <StyledTouchableOpacity onPress={() => removeTag(index)}>
                  <StyledText className="text-red-500">Eliminar</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            ))}
          </StyledView>
        )}

        <StyledTouchableOpacity
          onPress={addTag}
          className={`p-4 mb-4 rounded-lg ${isValidTag ? 'bg-yellow-600' : 'bg-gray-300'}`}
          disabled={!isValidTag}
        >
          <StyledText className="text-white text-center">Añadir Tag</StyledText>
        </StyledTouchableOpacity>

        {/* Botón para elegir la imagen */}
        <StyledTouchableOpacity onPress={pickImage} className="bg-yellow-600 p-4 mb-4 rounded-lg">
          <StyledText className="text-white text-center">Seleccionar Foto de la Receta</StyledText>
        </StyledTouchableOpacity>

        {/* Mostrar imagen seleccionada */}
        {image && (
          <StyledImage source={{ uri: image }} className="w-full h-64 mb-4 rounded-lg" />
        )}

        {/* Botón para subir la receta */}
        <StyledTouchableOpacity onPress={submitRecipe} className="bg-yellow-600 p-4 rounded-lg">
          <StyledText className="text-white text-center">Subir Receta</StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </KeyboardAvoidingView>
  );
}
