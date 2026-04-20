import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { decode } from 'base64-arraybuffer'; // ✅ AÑADIR ESTO (instala con: npm install base64-arraybuffer)
import * as FileSystem from 'expo-file-system/legacy'; // ✅ AÑADIR ESTO
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
// Cambia SafeAreaView de 'react-native' a 'react-native-safe-area-context' si lo usas
import {
  ActivityIndicator, // ✅ AÑADIR ESTO para el estado de carga
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// ✅ IMPORT CORRECTO (FUERA DEL COMPONENTE ESTÁ BIEN)
const defaultImage = require("../../../assets/images/image.png");

export default function EditPet() {
  const { id } = useLocalSearchParams();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [vaccines, setVaccines] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]); // Inicializado como array vacío ✅
  const [newAllergy, setNewAllergy] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPetData = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setCurrentImage(data.image_url);
        setVaccines(data.vaccines || "");
        // ✅ IMPORTANTE: Si data.allergies es null, usamos un array vacío []
        setAllergies(Array.isArray(data.allergies) ? data.allergies : []);
      }
    };
    loadPetData();
  }, [id]);

  // 📸 SELECCIONAR FOTO
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ✅ CAMBIO: Usa este formato para evitar el Warning
      quality: 0.5, // ✅ RECOMENDACIÓN: 0.5 hace que la subida sea más ligera y falle menos
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ☁️ SUBIR IMAGEN (CONVERSIÓN MEJORADA)
  const uploadImage = async () => {
  if (!image) return null;
  try {
    const fileName = `pet_${id}_${Date.now()}.jpg`;
    
    // Al haber cambiado el import a 'expo-file-system/legacy', 
    // esta línea ya no arrojará el error de "Method deprecated"
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64', 
    });

    const { data, error } = await supabase.storage
      .from("pets")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from("pets").getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (err) {
    console.error("Error en subida:", err);
    return null;
  }
};

  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    setAllergies([...allergies, newAllergy.trim()]);
    setNewAllergy("");
  };

  // 💾 GUARDAR CAMBIOS
  const handleSave = async () => {
    if (!id) {
      Alert.alert("Error", "No se encontró el ID de la mascota");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = currentImage;

      if (image) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          Alert.alert("Error", "No se pudo subir la imagen, revisa tu conexión.");
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase
        .from("pets")
        .update({
          image_url: imageUrl,
          vaccines: vaccines,
          allergies: allergies
        })
        .eq("id", id);

      if (error) throw error;

      Alert.alert("Éxito", "Cambios guardados ✅", [
        { text: "OK", onPress: () => router.back() }
      ]);

    } catch (err: any) {
      console.log("Error general:", err);
      Alert.alert("Error", err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Image source={require("../../logo.png")} style={styles.logo} />
      </View>

      {/* NOMBRE */}
      <View style={styles.nameBox}>
        <Text style={styles.name}>Editando Mascota</Text>
      </View>

      {/* FOTO */}
      <Text style={styles.label}>Actualizar foto:</Text>
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        <Image
          source={
            image ? { uri: image } : currentImage ? { uri: currentImage } : defaultImage
          }
          style={styles.image}
        />
        <View style={styles.camera}>
          <MaterialIcons name="add-a-photo" size={28} color="white" />
        </View>
      </TouchableOpacity>

      {/* FILA DE DATOS */}
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Alergias:</Text>
          <View style={styles.smallBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                placeholder="Nueva"
                placeholderTextColor="#ccc"
                style={{ color: "white", flex: 1 }}
                value={newAllergy}
                onChangeText={setNewAllergy}
              />
              <TouchableOpacity onPress={addAllergy}>
                <MaterialIcons name="add-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* ✅ PROTECCIÓN EXTRA: Usamos allergies?.map o (allergies || []) */}
            {allergies?.map((item, index) => (
              <Text key={index} style={{ color: "white", fontSize: 12 }}>
                • {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Vacunas:</Text>
          <View style={styles.smallBox}>
            <TextInput
              multiline
              value={vaccines}
              onChangeText={setVaccines}
              style={{ color: "white", minHeight: 60 }}
            />
          </View>
        </View>
      </View>

      {/* BOTÓN */}
      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" /> // ✅ Muestra un círculo de carga
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Guardar cambios
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f2a44",
    padding: 20
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logo: {
    width: 60,
    height: 60
  },

  nameBox: {
    backgroundColor: "#d1d5db",
    padding: 12,
    borderRadius: 15,
    marginVertical: 15
  },

  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  },

  label: {
    color: "white",
    marginBottom: 5
  },

  imageBox: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginBottom: 20
  },

  image: {
    width: 220,
    height: 220
  },

  camera: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 50
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  box: {
    width: "48%"
  },

  smallBox: {
    backgroundColor: "#1e3a5f",
    borderRadius: 12,
    padding: 15
  },

  saveBtn: {
    backgroundColor: "#1e3a5f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20
  }
});