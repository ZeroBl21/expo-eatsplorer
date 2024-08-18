import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useAuth } from '@/context/auth-context';
import api from '@/api/db';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Shelf = () => {
  const { authState } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newIngredient, setNewIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [predefinedIngredients, setPredefinedIngredients] = useState([]); // Lista de ingredientes predefinidos desde la API
  const [isValidIngredient, setIsValidIngredient] = useState(false); // Estado para validar el ingrediente

  useEffect(() => {
    async function fetchPantryItems() {
      setIsLoading(true);
      const data = await api.pantry.list(authState?.token);
      if (data.isSuccess) {
        setPantryItems(data.pantryItems);
      } else {
        console.warn(data.message || 'Error loading pantry items');
      }
      setIsLoading(false);
    }

    async function fetchIngredients() {
      const data = await api.ingredients.list(authState?.token);
      if (data.isSuccess) {
        setPredefinedIngredients(data.ingredients);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los ingredientes.');
      }
    }

    if (authState?.userId) {
      fetchPantryItems();
      fetchIngredients();
    }
  }, [authState]);

  const handleIngredientInputChange = (text) => {
    setNewIngredient(text);
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

  const handleAddItem = async () => {
    if (!isValidIngredient || !quantity.trim()) {
      Alert.alert('Error', 'Por favor, selecciona un ingrediente de la lista y agrega una cantidad.');
      return;
    }

    const selectedIngredient = predefinedIngredients.find(
      ingredient => ingredient.name.toLowerCase() === newIngredient.toLowerCase()
    );

    const newItem = { 
      id_ingrediente: selectedIngredient.id, 
      nombre: selectedIngredient.name, 
      cantidad: parseInt(quantity), 
      fecha_agregado: new Date().toISOString() 
    };

    const data = await api.pantry.addOrUpdateItem(newItem, authState?.token);
    if (data.isSuccess) {
      Alert.alert('Éxito', 'Ingrediente agregado/actualizado en la despensa.');
      setPantryItems([...pantryItems, newItem]);
      setNewIngredient('');
      setQuantity('');
      setFilteredIngredients([]);
      setIsValidIngredient(false);
    } else {
      Alert.alert('Error', data.message || 'No se pudo agregar/actualizar el ingrediente.');
    }
  };

  const handleUpdateQuantity = async (id_ingrediente, newQuantity) => {
    if (newQuantity <= 0) {
      // Eliminar el ingrediente si la cantidad llega a 0
      const result = await api.pantry.deleteItem(authState.token, id_ingrediente);
      if (result.isSuccess) {
        Alert.alert('Éxito', 'Ingrediente eliminado de la despensa.');
        // Filtrar el elemento eliminado de la lista
        setPantryItems(pantryItems.filter(item => item.id_ingrediente !== id_ingrediente));
      } else {
        Alert.alert('Error', result.message || 'No se pudo eliminar el ingrediente.');
      }
    } else {
      // Actualizar la cantidad si es mayor que 0
      const result = await api.pantry.updateItemQuantity(authState.token, id_ingrediente, newQuantity);
      if (result.isSuccess) {
        Alert.alert('Éxito', 'Cantidad actualizada correctamente.');
        // Actualizar la lista de la despensa
        setPantryItems(pantryItems.map(item => 
            item.id_ingrediente === id_ingrediente ? { ...item, cantidad: newQuantity } : item
        ));
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar la cantidad.');
      }
    }
  };

  const handleDeleteItem = async (id_ingrediente) => {
    const result = await api.pantry.deleteItem(authState.token, id_ingrediente);
    if (result.isSuccess) {
      Alert.alert('Éxito', 'Ingrediente eliminado de la despensa.');
      setPantryItems(pantryItems.filter(item => item.id_ingrediente !== id_ingrediente));
    } else {
      Alert.alert('Error', result.message || 'No se pudo eliminar el ingrediente.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString();
  };

  return (
    <SafeAreaView className="bg-primary flex-1 py-6 px-4">
      <StyledView className="mb-4">
        <StyledText className="text-3xl font-bold text-center text-yellow-600">Mi Despensa</StyledText>
      </StyledView>

      <ScrollView className="gap-y-4 w-full mx-auto mt-2 px-2">
        {isLoading ? (
          <StyledText className="text-center text-lg text-yellow-600">Cargando...</StyledText>
        ) : pantryItems.length > 0 ? (
          pantryItems.map((item) => (
            <StyledView key={item.id_ingrediente} className="bg-white p-4 rounded-md border border-gray-300 shadow-sm mb-4">
              <StyledText className="text-lg font-bold text-gray-800">{item.nombre}</StyledText>
              <StyledText className="text-sm text-gray-500">Cantidad: {item.cantidad}</StyledText>
              <StyledText className="text-sm text-gray-500">Fecha agregado: {formatDate(item.fecha_agregado)}</StyledText>
              
              <StyledView className="flex-row mt-2">
                <StyledTouchableOpacity
                  className="bg-green-600 p-2 rounded-md mr-2"
                  onPress={() => handleUpdateQuantity(item.id_ingrediente, item.cantidad + 1)}
                >
                  <StyledText className="text-white">Aumentar</StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  className="bg-red-600 p-2 rounded-md mr-2"
                  onPress={() => handleUpdateQuantity(item.id_ingrediente, item.cantidad > 0 ? item.cantidad - 1 : 0)}
                >
                  <StyledText className="text-white">Disminuir</StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  className="bg-yellow-600 p-2 rounded-md"
                  onPress={() => handleDeleteItem(item.id_ingrediente)}
                >
                  <StyledText className="text-white">Eliminar</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          ))
        ) : (
          <StyledText className="text-center text-lg text-gray-600">Tu despensa está vacía. ¡Empieza a agregar ingredientes!</StyledText>
        )}
      </ScrollView>

      <StyledView className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <StyledText className="text-lg font-bold text-gray-800 mb-2">Agregar Ingrediente</StyledText>
        <StyledTextInput
          className="border border-gray-300 p-4 mb-4 rounded-lg text-gray-800"
          placeholder="Nombre del ingrediente"
          placeholderTextColor="#aaa"
          value={newIngredient}
          onChangeText={handleIngredientInputChange}
        />
        {/* Mostrar sugerencias de autocompletado */}
        {filteredIngredients.length > 0 && (
          <StyledView className="border border-gray-300 rounded-lg max-h-40 overflow-hidden">
            <FlatList
              data={filteredIngredients}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setNewIngredient(item.name);
                    setIsValidIngredient(true);
                    setFilteredIngredients([]); // Oculta la lista de sugerencias
                  }}
                >
                  <StyledText className="p-2 bg-gray-200 border-b border-gray-300">{item.name}</StyledText>
                </TouchableOpacity>
              )}
            />
          </StyledView>
        )}
        <StyledTextInput
          className="border border-gray-300 p-4 mb-4 rounded-lg text-gray-800"
          placeholder="Cantidad"
          placeholderTextColor="#aaa"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <StyledTouchableOpacity
          onPress={handleAddItem}
          className={`p-4 rounded-lg ${isValidIngredient && quantity.trim() ? 'bg-yellow-600' : 'bg-gray-400'}`}
          disabled={!isValidIngredient || !quantity.trim()}
        >
          <StyledText className="text-white text-center text-lg font-semibold">Agregar a Despensa</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </SafeAreaView>
  );
};

export default Shelf;
