import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, ImageBackground, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { images } from '../../constants';
import Button from '@/components/Button';

const markdownContent = `
### Título Principal

Este es un párrafo con *texto en cursiva* y **texto en negrita**.

- Elemento de lista 1
- Elemento de lista 2

### Preparar los guandules

Si usas guandules frescos o secos, cocínalos en agua con sal hasta que estén tiernos. Si usas guandules enlatados, escúrrelos y enjuágalos.

### Sofrito

En una olla grande, calienta 2 cucharadas de aceite a fuego medio.  
Agrega 1 cebolla picada, 1 pimiento verde picado, 1 pimiento rojo picado, 2 dientes de ajo picados y 1 ají cubanela picado (opcional).  
Sofríe hasta que las verduras estén tiernas y fragantes (5-7 minutos).

### Añadir condimentos

- Agrega 1 cucharadita de pasta de tomate,
- 1/2 cucharadita de orégano,
- 1/2 cucharadita de comino (opcional),
- 1/2 cucharadita de cilantro picado (opcional),
- 2 hojas de laurel,
- 1 cucharadita de vinagre,
- sal y pimienta al gusto.  
- Cocina por 2-3 minutos, removiendo constantemente.

### Añadir guandules

- Agrega 1 taza de guandules cocidos y mezcla bien.  
- Cocina por 2-3 minutos adicionales.

### Añadir arroz y líquido

Agrega 2 tazas de arroz y remueve bien.  
Añade 4 tazas de agua o caldo de pollo.  
Remueve bien y lleva a hervir.

### Cocinar

Una vez que hierva, reduce el fuego a medio-bajo y tapa la olla.  
Cocina por 20-25 minutos, o hasta que el líquido se haya absorbido y el arroz esté tierno. No destapes la olla durante este tiempo.

### Reposar

Apaga el fuego y deja reposar el moro tapado por 5-10 minutos.

### Servir

Remueve el moro con un tenedor para esponjar el arroz.  
Sirve caliente.
`;

export default function Recipe() {
  return (
    <SafeAreaView className="flex-1 bg-offwhite" >
      <ScrollView>
        <View className='mt-8 h-[40vh] p-2'>
          <Image className="h-full w-full rounded" source={images.moro} resizeMode="cover" />
        </View>
        <View className='py-2 px-3 flex-row justify-between'>
          <View>
            <Text className='text-xl font-inter-bold'>Moro de Guandules</Text>
            <Text className='text-xs font-inter-medium text-offblack'>12,435 Likes</Text>
          </View>
          <Button
            title="Bookmark"
            containerStyles="border-0 py-1 bg-brand"
            textStyles="font-xs"
          />
        </View>

        <View className='px-3'>
          <View>
            <Text className='text-md font-inter-medium py-2'>Ingredientes <Text className='text-red-500 font-inter-bold'>(Faltan Ingredientes!)</Text></Text>
            <View>
              <Text className='font-inter-regular'>- 2 Cucharadas grandes Aceite De Canola</Text>
              <Text className='font-inter-regular text-red-500'>- 4 Ajos</Text>
              <Text className='font-inter-regular'>- 1 Ají cubanela picado</Text>
              <Text className='font-inter-regular'>- 1 Cebolla Roja picadita</Text>
              <Text className='font-inter-regular text-red-500'>- 1 Manojo Cilantro picadito</Text>
              <Text className='font-inter-regular'>- 2 Sobres Sopita En Polvo Gallinita Maggi®</Text>
              <Text className='font-inter-regular text-red-500'>- 425 Gramos Guandules Verdes o una lata de 15 oz. escurridos</Text>
              <Text className='font-inter-regular'>- 3 Tazas Agua caliente</Text>
              <Text className='font-inter-regular'>- 1 Libra Arroz Largo</Text>
            </View>
          </View>

          <View className='pb-4'>
            <Text>Instrucciones</Text>
            <View className='![& > *]:text-red-500'>
              {/* @ts-ignore */}
              <Markdown style={styles.markdown}>{markdownContent}</Markdown>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  markdown: {
    // @ts-ignore
    text: {
      fontFamily: "Inter_400Regular"
    },
    heading1: {
      marginTop: 10,
      marginBottom: 2,
      fontSize: 24,
      fontFamily: "Inter_500Medium",
    },
    heading2: {
      marginTop: 10,
      marginBottom: 2,
      fontSize: 20,
      fontFamily: "Inter_500Medium",
    },
    heading3: {
      marginTop: 10,
      marginBottom: 2,
      fontSize: 20,
      fontFamily: "Inter_500Medium",
    },
    listItem: {
      fontSize: 16,
      color: 'gray',
    },
    // Agrega más estilos según sea necesario
  },
});
