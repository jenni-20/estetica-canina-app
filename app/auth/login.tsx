import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();

  // 🔥 ESTADOS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Bienvenido 🔥");
     router.replace("/(tabs)/home"); // ✅ ajusta si tu home está en (tabs)
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

      {/* TITULO */}
      <Text style={styles.title}>Hola de nuevo</Text>

      {/* EMAIL */}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        placeholder="correo@gmail.com"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* PASSWORD */}
      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        placeholder="********"
        placeholderTextColor="#ccc"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* BOTÓN */}
      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.btnText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* OLVIDÉ */}
      <Text
        style={styles.link}
        onPress={() => router.push('/auth/forgot-password')}
      >
        ¿Olvidaste tu contraseña?
      </Text>

      {/* REGISTRO */}
      <Text
        style={styles.link}
        onPress={() => router.push('/auth/register')}
      >
        ¿No tienes cuenta? <Text style={{ color: 'white' }}>Crea una</Text>
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
    marginBottom: 20
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'white'
  },
  title: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 25
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