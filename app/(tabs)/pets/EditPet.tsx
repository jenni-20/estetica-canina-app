import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function EditPet() {

  const [image, setImage] = useState<string | null>(null);
  const [vaccines, setVaccines] = useState("Rabia\nParvovirus\nLeptospirosis");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");

  // 📸 SELECCIONAR FOTO
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ☁️ SUBIR IMAGEN
  const uploadImage = async () => {
    if (!image) return null;

    const fileName = `pet_${Date.now()}.jpg`;

    const response = await fetch(image);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from("pets")
      .upload(fileName, blob, {
        contentType: "image/jpeg"
      });

    if (error) {
      console.log(error);
      return null;
    }

    const { data } = supabase.storage
      .from("pets")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ➕ AGREGAR ALERGIA
  const addAllergy = () => {
    if (!newAllergy) return;

    setAllergies([...allergies, newAllergy]);
    setNewAllergy("");
  };

  // 💾 GUARDAR CAMBIOS
  const handleSave = async () => {
    const imageUrl = await uploadImage();

    console.log("Imagen:", imageUrl);
    console.log("Vacunas:", vaccines);
    console.log("Alergias:", allergies);

    alert("Cambios guardados ✅");
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={28} color="white" />
        <Image source={require("../../logo.png")} style={styles.logo} />
      </View>

      {/* NOMBRE */}
      <View style={styles.nameBox}>
        <Text style={styles.name}>Nombre_de_Mascota</Text>
      </View>

      {/* FOTO */}
      <Text style={styles.label}>Actualizar foto:</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Image source={{ uri: "https://placedog.net/400" }} style={styles.image} />
        )}

        <View style={styles.camera}>
          <MaterialIcons name="add-a-photo" size={28} color="white" />
        </View>
      </TouchableOpacity>

      {/* ALERGIAS */}
      <View style={styles.row}>

        <View style={styles.box}>
          <Text style={styles.label}>Agregar Alergias:</Text>

          <View style={styles.smallBox}>
            <TextInput
              placeholder="Nueva alergia"
              placeholderTextColor="#ccc"
              style={{ color: "white", marginBottom: 10 }}
              value={newAllergy}
              onChangeText={setNewAllergy}
            />

            <TouchableOpacity onPress={addAllergy}>
              <MaterialIcons name="add-circle" size={30} color="white" />
            </TouchableOpacity>

            {allergies.map((item, index) => (
              <Text key={index} style={{ color: "white" }}>
                • {item}
              </Text>
            ))}
          </View>
        </View>

        {/* VACUNAS */}
        <View style={styles.box}>
          <Text style={styles.label}>Actualizar vacunas:</Text>

          <View style={styles.smallBox}>
            <TextInput
              multiline
              value={vaccines}
              onChangeText={setVaccines}
              style={{ color: "white", width: "100%" }}
            />
          </View>
        </View>

      </View>

      {/* BOTÓN GUARDAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Guardar cambios
        </Text>
      </TouchableOpacity>

    </View>
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