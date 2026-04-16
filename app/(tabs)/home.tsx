import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  // 🔥 OBTENER USUARIO REAL
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUserEmail(data.user.email ?? "");
      }
    };

    getUser();
  }, []);

  return (
    <View style={{ padding: 20 }}>

      {/* 🔥 MOSTRAR USUARIO */}
      <Text style={{ marginBottom: 20, fontSize: 16 }}>
        Bienvenido: {userEmail}
      </Text>

      <Button
        title="Mascotas"
        onPress={() => router.push('/(tabs)/pets')}
      />

      <Button
        title="Perfil"
        onPress={() => router.push('/(tabs)/profile')}
      />

      <Button
        title="Citas"
        onPress={() => router.push('/(tabs)/quotes')}
      />

    </View>
  );
}