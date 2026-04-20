import * as ImagePicker from 'expo-image-picker'; // Necesario para la foto
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView, // Añadido para evitar que el teclado tape los campos
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // Necesario para el mapa
import { supabase } from '../../lib/supabase';

export default function Register() {
  const router = useRouter();

  // --- ESTADOS BÁSICOS ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'PROVIDER'>('CLIENT');

  // --- ESTADOS DE ESTABLECIMIENTO (PROVIDER) ---
  const [estName, setEstName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [marker, setMarker] = useState({
    latitude: 19.4326,
    longitude: -99.1332,
  });

  // Servicios predeterminados basados en tu DB
  const [availableServices] = useState([
    'Esterilización', 'Desparasitación', 'Consultas', 'Vacunas', 'Peluquería Completa'
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState('');

  // Función para quitar/poner servicios
  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Función para agregar uno que no esté en la lista
  const addCustomService = () => {
    if (customService.trim() && !selectedServices.includes(customService)) {
      setSelectedServices([...selectedServices, customService.trim()]);
      setCustomService('');
    }
  };

  // --- FUNCIÓN PARA SELECCIONAR FOTO ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- FUNCIÓN PARA SUBIR A BUCKET ---
  const uploadImage = async (uri: string, userId: string) => {
    const fileName = `logo_${userId}_${Date.now()}.jpg`;
    const response = await fetch(uri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from('establishment')
      .upload(fileName, blob);

    if (error) throw error;

    const { data } = supabase.storage.from('establishment').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // --- LÓGICA DE REGISTRO CORREGIDA ---
  const handleRegister = async () => {
    // 1. Validaciones básicas
    if (!email || !password) {
      alert('Faltan datos de acceso');
      return;
    }

    if (role === 'CLIENT' && !name) {
      alert('Por favor coloca tu nombre');
      return;
    }

    if (role === 'PROVIDER' && !estName) {
      alert('Por favor coloca el nombre de tu estética');
      return;
    }

    try {
      // 2. Crear el usuario en la autenticación de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const userId = authData.user.id;

        // PASO A: Primero el perfil de usuario (Evita error de FK y campo Name)
        const { error: dbError } = await supabase.from('users').insert([
          {
            id: userId,
            email: email.trim(),
            role: role,
            name: role === 'PROVIDER' ? estName : name // ✅ Campo obligatorio cubierto
          }
        ]);

        if (dbError) throw dbError;

        // PASO B: Si es PROVIDER, subir imagen y crear estética
        if (role === 'PROVIDER') {
          let publicImageUrl = null;

          if (image) {
            publicImageUrl = await uploadImage(image, userId);
          }

          const { error: estError } = await supabase.from('establishments').insert([
            {
              name: estName,
              location: "Ubicación en mapa", // ✅ Columna obligatoria
              description: selectedServices.join(', '),
              owner_id: userId,
              image_url: publicImageUrl,
              latitude: marker.latitude,
              longitude: marker.longitude,
            },
          ]);

          if (estError) throw estError;
        }

        alert('¡Cuenta creada con éxito! 🔥');

        // 3. Redirección lógica
        if (role === 'PROVIDER') {
          router.replace('/establishments/dashboard');
        } else {
          router.replace('/auth/login');
        }
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }; // ✅ Cierre de función corregido


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Regístrate</Text>

      {/* Selector de Rol */}
      <Text style={styles.label}>¿Qué tipo de cuenta deseas?</Text>
      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'CLIENT' && styles.roleBtnActive]}
          onPress={() => setRole('CLIENT')}
        >
          <Text style={role === 'CLIENT' ? styles.roleTextActive : styles.roleText}>Dueño de Mascota</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleBtn, role === 'PROVIDER' && styles.roleBtnActive]}
          onPress={() => setRole('PROVIDER')}
        >
          <Text style={role === 'PROVIDER' ? styles.roleTextActive : styles.roleText}>Estética Canina</Text>
        </TouchableOpacity>
      </View>

      {/* --- SECCIÓN PARA DUEÑO DE MASCOTA (CLIENT) --- */}
      {role === 'CLIENT' && (
        <View>
          <Text style={styles.label}>Nombre Personal:</Text>
          <TextInput placeholder="Tu nombre" placeholderTextColor="#ccc" style={styles.input} onChangeText={setName} />

          <Text style={styles.label}>Email:</Text>
          <TextInput placeholder="correo@gmail.com" placeholderTextColor="#ccc" style={styles.input} keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} />

          <Text style={styles.label}>Teléfono:</Text>
          <TextInput placeholder="Teléfono" placeholderTextColor="#ccc" style={styles.input} keyboardType="phone-pad" onChangeText={setPhone} />

          <Text style={styles.label}>Contraseña:</Text>
          <TextInput placeholder="Mínimo 6 caracteres" placeholderTextColor="#ccc" secureTextEntry style={styles.input} onChangeText={setPassword} />
        </View>
      )}

      {/* --- SECCIÓN PARA ESTÉTICA (PROVIDER) - ESTILO UNIFICADO --- */}
      {role === 'PROVIDER' && (
        <View>
          <Text style={styles.sectionTitle}>Datos de tu Negocio ✂️</Text>

          <Text style={styles.label}>Email de acceso:</Text>
          <TextInput placeholder="correo@negocio.com" placeholderTextColor="#ccc" style={styles.input} onChangeText={setEmail} autoCapitalize="none" />

          <Text style={styles.label}>Contraseña:</Text>
          <TextInput placeholder="Crea una contraseña" placeholderTextColor="#ccc" secureTextEntry style={styles.input} onChangeText={setPassword} />

          <Text style={styles.label}>Nombre de la Estética:</Text>
          <TextInput
            placeholder="Ej. Estética Canina 'Firulais'"
            placeholderTextColor="#ccc"
            style={styles.input}
            onChangeText={setEstName}
          />

          <Text style={styles.label}>Selecciona tus servicios:</Text>
          <View style={styles.servicesGrid}>
            {availableServices.map((service) => (
              <TouchableOpacity
                key={service}
                style={[
                  styles.serviceChip,
                  selectedServices.includes(service) && styles.serviceChipActive
                ]}
                onPress={() => toggleService(service)}
              >
                <Text style={selectedServices.includes(service) ? styles.btnText : styles.roleText}>
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>¿Ofreces otro servicio?</Text>
          <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <TextInput
              placeholder="Ej. Spa Canino"
              placeholderTextColor="#ccc"
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={customService}
              onChangeText={setCustomService}
            />
            <TouchableOpacity onPress={addCustomService} style={styles.addBtn}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
            <Text style={styles.btnText}>
              {image ? "✅ Foto Seleccionada" : "📸 Subir Logo o foto de la Estética"}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={{ width: '100%', height: 180, borderRadius: 10, marginBottom: 15 }} />
          )}

          <Text style={styles.label}>Marca tu ubicación en el mapa:</Text>
          <View style={styles.mapOverflow}>
            <MapView
              style={styles.map}
              initialRegion={{
                ...marker,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              onPress={(e) => setMarker(e.nativeEvent.coordinate)}
            >
              <Marker coordinate={marker} title="Mi Estética" pinColor="#4a90e2" />
            </MapView>
            <Text style={{ color: 'gray', fontSize: 10, marginTop: 5 }}>
              Ubicación capturada: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      )}

      {/* Botón de Registro */}
      <TouchableOpacity onPress={handleRegister} style={styles.btn}>
        <Text style={styles.btnText}>Crear Cuenta</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => router.push('/auth/login')}>
        ¿Ya tienes cuenta? <Text style={{ color: 'white' }}>Inicia Sesión</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // 🔥 Esto asegura que el scroll funcione perfecto
    padding: 20,
    backgroundColor: '#1e3a5f',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'white'
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  roleBtnActive: {
    backgroundColor: '#9ca3af',
    borderColor: 'white',
  },
  roleText: {
    color: '#ccc',
  },
  roleTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20
  },
  label: {
    color: 'white'
  },
  input: {
    backgroundColor: '#2c4a6e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: 'white'
  },
  btn: {
    backgroundColor: '#9ca3af',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  btnText: {
    fontWeight: 'bold',
    color: '#ffffff'
  },
  link: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 15
  },
  // --- ESTILOS PARA LOS CAMPOS EXTRA (ESTÉTICA) ---
  extraFields: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#2c4a6e', // Azul ligeramente más claro para resaltar
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4a90e2',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#4a90e2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  photoBtn: {
    backgroundColor: '#1e3a5f',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
  },

  // --- ESTILOS DEL MAPA ---
  mapOverflow: {
    height: 220,
    borderRadius: 15,
    overflow: 'hidden', // Importante para que el mapa respete el redondeado
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // --- ESTILOS DE servicios ---
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  serviceChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4a90e2',
    backgroundColor: 'transparent',
  },
  serviceChipActive: {
    backgroundColor: '#4a90e2',
  },
  addBtn: {
    backgroundColor: '#4a90e2',
    width: 50,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});