import { useRouter } from 'expo-router';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Register() {
  const router = useRouter();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#1e3a5f'
    }}>

      {/* LOGO */}
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Image
          source={require('./logo.png')}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: 'white'
          }}
        />
      </View>

      {/* TÍTULO */}
      <Text style={{
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10
      }}>
        Regístrate
      </Text>

      <Text style={{
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 20
      }}>
        Completa los siguientes campos correctamente:
      </Text>

      {/* NOMBRE */}
      <Text style={{ color: 'white' }}>Nombre:</Text>
      <TextInput
        placeholder="Coloca tu nombre"
        placeholderTextColor="#ccc"
        style={inputStyle}
      />

      {/* EMAIL */}
      <Text style={{ color: 'white' }}>Email:</Text>
      <TextInput
        placeholder="@gmail.com"
        placeholderTextColor="#ccc"
        style={inputStyle}
      />

      {/* TELÉFONO */}
      <Text style={{ color: 'white' }}>Teléfono:</Text>
      <TextInput
        placeholder="Teléfono"
        placeholderTextColor="#ccc"
        style={inputStyle}
      />

      {/* PASSWORD */}
      <Text style={{ color: 'white' }}>Contraseña:</Text>
      <TextInput
        placeholder="Coloca tu contraseña"
        placeholderTextColor="#ccc"
        secureTextEntry
        style={inputStyle}
      />

      {/* BOTÓN */}
      <TouchableOpacity style={{
        backgroundColor: '#9ca3af',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
      }}>
        <Text style={{ fontWeight: 'bold' }}>
          Crear Cuenta
        </Text>
      </TouchableOpacity>

      {/* IR A LOGIN */}
      <Text
  style={{ color: '#ccc', textAlign: 'center', marginTop: 15 }}
  onPress={() => router.push('/login')}
>
  ¿Ya tienes cuenta? <Text style={{ color: 'white' }}>Inicia Sesión</Text>
</Text>

    </View>
  );
}

const inputStyle = {
  backgroundColor: '#2c4a6e',
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  color: 'white'
};