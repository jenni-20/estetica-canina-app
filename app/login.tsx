import { View, Text, TextInput, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#1e3a5f'
    }}>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={require('./logo.png')}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            borderWidth: 2,
            borderColor: 'white'
          }}
        />
      </View>

      <Text style={{
        color: 'white',
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 25
      }}>
        Hola de nuevo
      </Text>

      <Text style={{ color: 'white' }}>Email:</Text>
      <TextInput style={inputStyle} />

      <Text style={{ color: 'white' }}>Contraseña:</Text>
      <TextInput style={inputStyle} secureTextEntry />

      <TouchableOpacity
        onPress={() => router.push('/home')}
        style={btn}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>

      <Text
        style={{ color: '#ccc', textAlign: 'center', marginTop: 15 }}
        onPress={() => router.push('/register')}
      >
        ¿No tienes cuenta? <Text style={{ color: 'white' }}>Crea una</Text>
      </Text>

    </View>
  );
}

const inputStyle: TextStyle = {
  backgroundColor: '#2c4a6e',
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  color: 'white'
};

const btn: ViewStyle = {
  backgroundColor: '#9ca3af',
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 10
};