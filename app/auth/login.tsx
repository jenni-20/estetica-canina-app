import { Ionicons } from '@expo/vector-icons'; // 👈 NUEVO
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 NUEVO

  const handleLogin = async () => {
  // 1. Primero inicias sesión en Auth
  const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password,
  });

  if (authError) {
    alert(authError.message);
    return;
  }

  if (session) {
    // 2. Buscas el rol usando maybeSingle para evitar el error PGRST116
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle(); // 🔥 Esto evita que la app truene si no hay fila

    // Si el perfil no existe, es que el registro quedó a medias
    if (!profile) {
      alert("No se encontró un perfil para este usuario. Intenta registrarte de nuevo.");
      // Opcional: podrías borrar al usuario de Auth aquí o mandarlo a Register
      return;
    }

    // 3. Si todo está bien, redireccionas según el rol
    if (profile.role === 'PROVIDER') {
      router.replace('/establishments/dashboard');
    } else {
      router.replace('/(tabs)'); // O tu ruta de cliente
    }
  }
};

  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Image
          source={require('../logo.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Hola de nuevo</Text>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        placeholder="correo@gmail.com"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña:</Text>

      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder="********"
          placeholderTextColor="#ccc"
          style={styles.input}
          secureTextEntry={!showPassword} // 👈 CAMBIO
          value={password}
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

      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.btnText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => router.push('/auth/forgot-password')}
      >
        ¿Olvidaste tu contraseña?
      </Text>

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
    backgroundColor: '#1e3a5f',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'white',
  },
  title: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    color: 'white',
  },
  input: {
    backgroundColor: '#2c4a6e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: 'white',
  },
  btn: {
    backgroundColor: '#9ca3af',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 15,
  },
});