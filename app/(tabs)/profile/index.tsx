import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Profile() {

  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user;

      if (currentUser) {
        const { data: petsData } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', currentUser.id);

        setPets(petsData || []);
      }

    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f2a44'
      }}>
        <Text style={{ color: 'white' }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f2a44' }}>

      {/* 🔵 HEADER */}
      <View style={{
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 25,
        backgroundColor: '#1e3a5f',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>

        {/* 🔙 BOTÓN BONITO */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 55,
            height: 55,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',

            // sombra iOS
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,

            // sombra Android
            elevation: 6
          }}
        >
          <Text style={{
            fontSize: 26,
            color: 'white',
            fontWeight: 'bold'
          }}>
            ←
          </Text>
        </TouchableOpacity>

        <Image
          source={require('../../logo.png')}
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: 'white'
          }}
        />

        <Text style={{
          color: 'white',
          fontSize: 28,
          marginTop: 10,
          fontWeight: 'bold'
        }}>
          Mi Perfil
        </Text>
      </View>

      {/* 👤 USUARIO */}
      <View style={{
        backgroundColor: '#e5e7eb',
        margin: 20,
        padding: 15,
        borderRadius: 20
      }}>
        <Text style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 16
        }}>
          {user?.email || "Sin usuario"}
        </Text>
      </View>

      {/* 🐶 MASCOTAS */}
      <Text style={{
        color: 'white',
        marginLeft: 20,
        fontSize: 16,
        fontWeight: 'bold'
      }}>
        Tus mascotas:
      </Text>

      {pets.length === 0 && (
        <Text style={{ color: 'white', marginLeft: 20 }}>
          No tienes mascotas
        </Text>
      )}

      {pets.map((pet) => (
        <TouchableOpacity
          key={pet.id}
          onPress={() => router.push(`/profile/PetProfile?id=${pet.id}`)}
          style={{
            backgroundColor: '#2c4a6e',
            marginHorizontal: 15,
            marginTop: 10,
            padding: 15,
            borderRadius: 20
          }}
        >

          {pet.image_url ? (
            <Image
              source={{ uri: pet.image_url }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                marginBottom: 8
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 15,
              backgroundColor: '#1e3a5f',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8
            }}>
              <Text style={{ color: 'white', fontSize: 20 }}>🐶</Text>
            </View>
          )}

          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            {pet.name}
          </Text>

          <Text style={{ color: '#cbd5f5' }}>
            {pet.sex}
          </Text>

        </TouchableOpacity>
      ))}

      {/* ➕ AGREGAR */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/pets/CreatePet')}
        style={{
          backgroundColor: '#1e3a5f',
          margin: 20,
          padding: 15,
          borderRadius: 20,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          + Agregar mascota
        </Text>
      </TouchableOpacity>

      {/* 🚪 LOGOUT */}
      <TouchableOpacity
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace('/auth/login');
        }}
        style={{
          backgroundColor: '#9ca3af',
          marginHorizontal: 20,
          padding: 15,
          borderRadius: 20,
          alignItems: 'center'
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}