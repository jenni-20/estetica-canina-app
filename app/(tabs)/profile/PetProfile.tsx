import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function PetProfile() {

  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    getPet();
  }, []);

  const getPet = async () => {
    const { data } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    setPet(data);
  };

  const deletePet = async () => {
    Alert.alert(
      "Eliminar mascota",
      "¿Seguro que quieres eliminarla?",
      [
        { text: "Cancelar" },
        {
          text: "Eliminar",
          onPress: async () => {
            await supabase.from('pets').delete().eq('id', id);
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  if (!pet) {
    return <Text style={{ color: 'white', textAlign: 'center' }}>Cargando...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f2a44', padding: 20 }}>

      {/* REGRESAR */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: 'white' }}>⬅️</Text>
      </TouchableOpacity>

      {/* LOGO */}
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../../logo.png')} style={{ width: 80, height: 80 }} />
      </View>

      {/* NOMBRE */}
      <View style={{
        backgroundColor: '#e5e7eb',
        padding: 12,
        borderRadius: 20,
        marginVertical: 10
      }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {pet.name}
        </Text>
      </View>

      {/* IMAGEN (TEMPORAL) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Image
          source={{ uri: 'https://placedog.net/400' }}
          style={{ width: 200, height: 200, borderRadius: 20 }}
        />

        <View>

          {/* EDITAR */}
          <TouchableOpacity
            onPress={() => router.push(`/pets/EditPet?id=${pet.id}`)}
            style={{
              backgroundColor: '#1e3a5f',
              padding: 15,
              borderRadius: 15,
              marginBottom: 10
            }}
          >
            <Text style={{ color: 'white' }}>✏️ Editar</Text>
          </TouchableOpacity>

          {/* ELIMINAR */}
          <TouchableOpacity
            onPress={deletePet}
            style={{
              backgroundColor: '#1e3a5f',
              padding: 15,
              borderRadius: 15
            }}
          >
            <Text style={{ color: 'white' }}>❌ Eliminar</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* DATOS */}
      <Text style={{ color: 'white', marginTop: 20 }}>
        Datos de tu mascota:
      </Text>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
      }}>

        <Box title="Edad" value={`${pet.age} años`} />
        <Box title="Sexo" value={pet.sex} />
        <Box title="Alergias" value={pet.allergies || "Ninguna"} />

      </View>

    </View>
  );
}

const Box = ({ title, value }: any) => (
  <View style={{
    backgroundColor: '#1e3a5f',
    padding: 15,
    borderRadius: 15,
    width: 100,
    alignItems: 'center'
  }}>
    <Text style={{ color: 'white', fontWeight: 'bold' }}>{title}</Text>
    <Text style={{ color: '#ccc', textAlign: 'center' }}>{value}</Text>
  </View>
);