import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageStyle,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  //estado para mascotas
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    const getUserAndPets = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: petsData, error } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', currentUser.id);

        if (error) {
          console.error(error);
        } else {
          setPets(petsData);
        }
      }
    };

    getUserAndPets();
  }, []);

  return (
    <View style={{ flex: 1 }}>

      <ScrollView style={{ flex: 1, backgroundColor: '#0f2a44' }}>

        {/* HEADER */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 15,
          backgroundColor: '#1e3a5f',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20
        }}>

          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MaterialIcons name="menu" size={30} color="white" />
          </TouchableOpacity>

          <Image
            source={require('./logo.png')}
            style={{ width: 70, height: 70, borderRadius: 35 }}
          />

          <View style={{ width: 28 }} />
        </View>

        {/* BIENVENIDA */}
        <Text style={{
          color: 'white',
          fontSize: 28,
          textAlign: 'center',
          marginTop: 10
        }}>
          Bienvenid@
        </Text>

        {/* USUARIO */}
        <View style={{
          backgroundColor: '#e5e7eb',
          marginHorizontal: 20,
          padding: 12,
          borderRadius: 20,
          marginVertical: 10
        }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            👤 {user?.email || "Cargando..."}
          </Text>
        </View>

        {/* MASCOTAS */}
        <Text style={{ color: 'white', marginLeft: 20, marginBottom: 10, fontWeight: 'bold' }}>
          Tus mascotas:
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={petCard}
              onPress={() => router.push({ pathname: "/pets/[id]", params: { id: pet.id } })}
            >
              {/* Contenedor de imagen */}
              <View style={imageContainer}>
                <Image
                  source={{ uri: pet.image_url || "https://via.placeholder.com/150" }}
                  style={petImage}
                  resizeMode="cover"
                />

                {/* Capa oscura con el nombre (Overlay) */}
                <View style={petInfoOverlay}>
                  <Text style={petName}>{pet.name}</Text>
                  <Text style={petDesc}>{pet.species || "Mascota"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>


        {/* VETERINARIAS */}
        <Text style={{ color: 'white', marginLeft: 20, marginTop: 15 }}>
          Veterinarias cerca de ti:
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          <View style={vetCard}>
            <Text style={vetTitle}>Animal Pet Care</Text>
            <Text style={vetInfo}>⭐ 4.2 - 1.3 km</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Tag text="Baño" />
              <Tag text="Uñas" />
              <Tag text="Dientes" />
            </View>
          </View>
        </ScrollView>

      </ScrollView>

      {/* MENÚ */}
      {menuVisible && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 260,
          height: '100%',
          backgroundColor: '#1e3a5f',
          padding: 20
        }}>

          <TouchableOpacity onPress={() => setMenuVisible(false)}>
            <MaterialIcons name="close" size={25} color="white" />
          </TouchableOpacity>

          <Text style={{ color: 'white', fontSize: 22, marginVertical: 15 }}>
            Menu
          </Text>

          {/* 🔥 BOTONES FUNCIONALES CORREGIDOS */}
          <MenuItem
            icon="event"
            text="Agenda una cita"
            route="/(tabs)/quotes/CreateQuote"
            closeMenu={() => setMenuVisible(false)}
          />

          <MenuItem
            icon="pets"
            text="Registra una mascota"
            route="/(tabs)/pets/CreatePet"
            closeMenu={() => setMenuVisible(false)}
          />

          <MenuItem
            icon="person"
            text="Ver perfil"
            route="/(tabs)/profile"

            closeMenu={() => setMenuVisible(false)}
          />

          {/* 🔥 CERRAR SESIÓN */}
          <TouchableOpacity
            onPress={async () => {
              await supabase.auth.signOut();
              router.replace('/auth/login');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#334155'
            }}
          >
            <MaterialIcons name="logout" size={22} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: 'white' }}>Cerrar sesión</Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );
}

// 🐶 ESTILOS DE MASCOTAS ACTUALIZADOS
const petCard: ViewStyle = {
  width: 160,
  height: 140, // Altura fija para que todas se vean iguales
  marginRight: 15,
  borderRadius: 20,
  overflow: 'hidden', // Crucial para que la imagen no se salga de las esquinas
  backgroundColor: '#1e3a5f',
  elevation: 5,
};

const imageContainer: ViewStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
};

const petImage: ImageStyle = {
  width: '100%',
  height: '100%',
};

const petInfoOverlay: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo negro translúcido
  paddingVertical: 8,
  paddingHorizontal: 12,
};

const petName: TextStyle = {
  color: 'white',
  fontSize: 15,
  fontWeight: 'bold',
};

const petDesc: TextStyle = {
  color: '#B0C4DE',
  fontSize: 11,
};

// 🏥 VETERINARIAS
const vetCard: ViewStyle = {
  width: 220,
  backgroundColor: '#1e3a5f',
  borderRadius: 20,
  padding: 12,
  marginRight: 12
};

const vetTitle: TextStyle = {
  color: 'white',
  fontWeight: 'bold'
};

const vetInfo: TextStyle = {
  color: '#ccc'
};

// 🏷️ TAG
const Tag = ({ text }: any) => (
  <View style={{
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 5
  }}>
    <Text style={{ color: 'white', fontSize: 12 }}>{text}</Text>
  </View>
);

// 🔥 MENU ITEM CORREGIDO
const MenuItem = ({ icon, text, route, closeMenu }: any) => (
  <TouchableOpacity
    onPress={() => {
      closeMenu();
      router.push(route);
    }}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#334155'
    }}
  >
    <MaterialIcons name={icon} size={22} color="white" style={{ marginRight: 10 }} />
    <Text style={{ color: 'white' }}>{text}</Text>
  </TouchableOpacity>
);