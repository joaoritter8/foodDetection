import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { api } from '../../services/api';

import { styles } from './styles';

import { Tip } from '../../components/Tip';
import { Item, ItemProps } from '../../components/Item';
import { Button } from '../../components/Button';

export function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itens, setItens] = useState<ItemProps[]>([])

  async function handleSelectImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if(status !== ImagePicker.PermissionStatus.GRANTED){
        return Alert.alert("É necessário conceder permissão para acessar a galeria!");
      }

      setIsLoading(true);

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,4], 
        quality: 1
      })

      if(response.canceled){
        return setIsLoading(false);
      }

      if(!response.canceled){
        const imageManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{ resize: {width: 900}}],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        setSelectedImageUri(imageManipuled.uri);
        foodDetect(imageManipuled.base64);

 
      }
    } catch (error) {
      console.log(error);
    }  
  
  }

  async function foodDetect(imageBase64: string | undefined) {
    const response = await api.post(`/v2/models/food-item-recognition/versions/1d5fd481e0cf4826aa72ec3ff049e044/outputs`, {
      "user_app_id": {
        "user_id": "joaoritter",
        "app_id": "foodDetection"
      },
      "inputs": [
        {
          "data": {
            "image":{
              "base64": imageBase64
            }
          }
        }
      ]
    });

    const foods = response.data.outputs[0].data.concepts.map((concept: any) => {
      return {
        name: concept.name,
        percentage: `${Math.round(concept.value * 100)}%r`
      }
    });

    setItens(foods);
    setIsLoading(false)
    
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading} />

      {
        selectedImageUri ?
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          :
          <Text style={styles.description}>
            Selecione a foto do seu prato para analizar.
          </Text>
      }

      <View style={styles.bottom}>
        <Tip message="Aqui vai uma dica" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
          <View style={styles.items}>
            {
              itens.map((item) =>(
                parseInt(item.percentage) > 1 &&                
                <Item key={item.name} data={item} />
              ))
            
            }
          </View>
        </ScrollView>
      </View>
    </View>
  );
}