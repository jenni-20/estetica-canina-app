import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      Alert.alert("Error", "Ingresa tu correo");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Aquí después conectas Supabase
      console.log("Enviar correo a:", email);

      Alert.alert(
        "Correo enviado",
        "Revisa tu bandeja para recuperar tu contraseña"
      );

      setEmail("");
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Recuperar contraseña
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Ingresa tu correo electrónico
      </Text>

      <TextInput
        placeholder="correo@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleSend}
        style={{
          backgroundColor: "#007bff",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}