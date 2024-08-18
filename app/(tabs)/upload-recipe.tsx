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
 const [Porciones, setPorciones] = useState('');
 const [description, setDescription] = useState('');
 const [instructions, setInstructions] = useState('');
 const [ingredients, setIngredients] = useState([]);  // Lista de ingredientes seleccionados
 const [ingredientInput, setIngredientInput] = useState('');
 const [filteredIngredients, setFilteredIngredients] = useState([]);
 const [predefinedIngredients, setPredefinedIngredients] = useState([]); // Lista de ingredientes predefinidos desde la API
 const [isValidIngredient, setIsValidIngredient] = useState(false); // Estado para validar el ingrediente
 const [image, setImage] = useState(null);  // Estado para la imagen


 // Fetch the list of predefined ingredients dynamically
 useEffect(() => {
   async function fetchIngredients() {
     const data = await api.ingredients.list(authState?.token);
     if (data.isSuccess) {
       setPredefinedIngredients(data.ingredients);
     } else {
       Alert.alert('Error', 'No se pudieron cargar los ingredientes.');
     }
   }


   if (authState?.userId) {
     fetchIngredients();
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
   if (isValidIngredient && !ingredients.includes(ingredientInput)) {
     setIngredients([...ingredients, ingredientInput]);
     setIngredientInput('');
     setFilteredIngredients([]);
     setIsValidIngredient(false); // Reinicia la validación
   } else {
     Alert.alert('Error', 'El ingrediente debe seleccionarse de la lista de autocompletado y no debe estar ya en la lista.');
   }
 };


 const removeIngredient = (index) => {
   const newIngredients = [...ingredients];
   newIngredients.splice(index, 1);
   setIngredients(newIngredients);
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
     photo: imageUrl,  // Usamos la URL de la imagen subida
     userId: authState.userId,
     fecha_creacion: new Date().toISOString(),  // Fecha actual
     porciones: Porciones,
     likes: 0,
   };


   const recipeResponse = await api.recipes.uploadRecipe(recipe, authState.token);


   if (recipeResponse.isSuccess) {
     const recipeId = recipeResponse.data.id_receta;
     let ingredientIds = [];


     for (let i = 0; i < ingredients.length; i++) {
       const ingredient = { id_ingrediente: 0, nombre: ingredients[i], medida: 'al gusto', dias_vencimiento: 0 };
       const ingredientResponse = await api.recipes.uploadIngredient(ingredient, authState.token);
       ingredientIds.push(ingredientResponse.data.ingrediente.id_ingrediente);


     }


     console.log("ID de receta: ", recipeId);
     console.log("ID de los ingredientes: ", ingredientIds);


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
         className="border border-gray-300 p-4 mb-4 rounded-lg"
         placeholder="Porciones"
         placeholderTextColor="#888"
         value={Porciones}
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


       <StyledTouchableOpacity
         onPress={addIngredient}
         className={`p-4 mb-4 rounded-lg ${isValidIngredient ? 'bg-yellow-600' : 'bg-gray-300'}`}
         disabled={!isValidIngredient} // Desactiva el botón si no es un ingrediente válido
       >
         <StyledText className="text-white text-center">Añadir Ingrediente</StyledText>
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
