import { Ionicons } from '@expo/vector-icons'; // 👈 NUEVO
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const router = useRouter();

  // 🔥 ESTADOS
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 NUEVO

  // 🔥 REGISTRO
  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      alert('Completa todos los campos');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Cuenta creada 🔥');
      router.replace('/auth/login');
    }
  };

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../logo.png')}
          style={styles.logo}
        />
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Regístrate</Text>

      <Text style={styles.subtitle}>
        Completa los siguientes campos correctamente:
      </Text>

      {/* NOMBRE */}
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        placeholder="Coloca tu nombre"
        placeholderTextColor="#ccc"
        style={styles.input}
        onChangeText={setName}
      />

      {/* EMAIL */}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        placeholder="correo@gmail.com"
        placeholderTextColor="#ccc"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      {/* TELÉFONO */}
      <Text style={styles.label}>Teléfono:</Text>
      <TextInput
        placeholder="Teléfono"
        placeholderTextColor="#ccc"
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />

      {/* PASSWORD */}
      <Text style={styles.label}>Contraseña:</Text>

      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder="Coloca tu contraseña"
          placeholderTextColor="#ccc"
          secureTextEntry={!showPassword} // 👈 CAMBIO
          style={styles.input}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: 10,
            top: 12,
          }}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* BOTÓN */}
      <TouchableOpacity onPress={handleRegister} style={styles.btn}>
        <Text style={styles.btnText}>Crear Cuenta</Text>
      </TouchableOpacity>

      {/* IR A LOGIN */}
      <Text
        style={styles.link}
        onPress={() => router.push('/auth/login')}
      >
        ¿Ya tienes cuenta? <Text style={{ color: 'white' }}>Inicia Sesión</Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1e3a5f'
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
    fontWeight: 'bold'
  },
  link: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 15
  }
});