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
        <Text style={{ color: 'white', marginLeft: 20 }}>
          Tus mascotas:
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          <View style={petCard}>
            <Image source={{ uri: 'https://placedog.net/500' }} style={petImage} />
            <Text style={petName}>Charlie</Text>
            <Text style={petDesc}>Pitbull</Text>
          </View>

          <View style={petCard}>
            <Image source={{ uri: 'https://placekitten.com/200' }} style={petImage} />
            <Text style={petName}>Roxy</Text>
            <Text style={petDesc}>Gato</Text>
          </View>
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

// 🐶 MASCOTAS
const petCard: ViewStyle = {
  width: 150,
  backgroundColor: '#1e3a5f',
  borderRadius: 20,
  marginRight: 12,
  padding: 10
};

const petImage: ImageStyle = {
  width: '100%',
  height: 90,
  borderRadius: 12
};

const petName: TextStyle = {
  color: 'white',
  marginTop: 5,
  fontWeight: 'bold'
};

const petDesc: TextStyle = {
  color: '#ccc'
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