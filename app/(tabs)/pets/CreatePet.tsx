import { supabase } from "@/lib/supabase";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function CreatePet() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breeds, setBreeds] = useState<any[]>([]);
  const [breedId, setBreedId] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [allergies, setAllergies] = useState("");
  const [vaccines, setVaccines] = useState("");

  // 🔥 TRAER RAZAS
  useEffect(() => {
    const fetchBreeds = async () => {
      if (!species) return;

      const { data, error } = await supabase.from("breeds").select("*");

      if (error) {
        console.log(error);
        return;
      }

      const filtradas = data.filter(
        (item) => String(item.species).toUpperCase() === species
      );

      setBreeds(filtradas);
    };

    fetchBreeds();
  }, [species]);

  // 🔥 SELECCIONAR IMAGEN
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🔥 SUBIR IMAGEN
  const uploadImage = async () => {
    if (!image) return null;

    try {
      const fileName = `pet_${Date.now()}.jpg`;

      const response = await fetch(image);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from("pets")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
        });

      if (error) {
        console.log(error);
        return null;
      }

      const { data } = supabase.storage
        .from("pets")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // 🔥 GUARDAR
  const handleSave = async () => {
    if (!name || !age || !sex || !species) {
      alert("Completa los campos");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("No hay usuario");
      return;
    }

    const imageUrl = await uploadImage();

    const { error } = await supabase.from("pets").insert([
      {
        name,
        age: parseInt(age),
        sex,
        allergies,
        vaccines,
        breed_id: breedId ? parseInt(breedId) : null,
        owner_id: user.id,
        image_url: imageUrl
      }
    ]);

    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      alert("Guardado ✅");
      router.back();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Image
          source={require("../../logo.png")}
          style={styles.logo}
        />
      </View>

      {/* IMAGEN */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          />
        ) : (
          <Text style={{ fontSize: 40 }}>📷</Text>
        )}
      </TouchableOpacity>

      {/* NOMBRE */}
      <Text style={styles.label}>Nombre:</Text>
      <TextInput style={styles.input} onChangeText={setName} />

      {/* ESPECIE */}
      <Text style={styles.label}>Especie:</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={species || ""}
          onValueChange={(value) => {
            setSpecies(value);
            setBreedId("");
          }}
        >
          <Picker.Item label="Selecciona..." value="" />
          <Picker.Item label="Perro" value="DOG" />
          <Picker.Item label="Gato" value="CAT" />
        </Picker>
      </View>

      {/* FILA */}
      <View style={styles.row}>

        {/* RAZA */}
        <View style={styles.col}>
          <Text style={styles.label}>Raza:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={breedId || ""}
              onValueChange={(value) => setBreedId(value)}
            >
              <Picker.Item label="Selecciona..." value="" />
              {breeds.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.name}
                  value={item.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* EDAD */}
        <View style={styles.col}>
          <Text style={styles.label}>Edad:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={setAge}
          />
        </View>

        {/* SEXO */}
        <View style={styles.col}>
          <Text style={styles.label}>Sexo:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={sex || ""}
              onValueChange={(value) => setSex(value)}
            >
              <Picker.Item label="Selecciona..." value="" />
              <Picker.Item label="Macho" value="MACHO" />
              <Picker.Item label="Hembra" value="HEMBRA" />
            </Picker>
          </View>
        </View>

      </View>

      {/* ALERGIAS */}
      <Text style={styles.label}>Alergias:</Text>
      <TextInput style={styles.textArea} multiline onChangeText={setAllergies} />

      {/* VACUNAS */}
      <Text style={styles.label}>Vacunas:</Text>
      <TextInput style={styles.textArea} multiline onChangeText={setVaccines} />

      {/* BOTÓN */}
      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Crear Perfil de Mascota</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1e3a5f",
    flexGrow: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  back: {
    fontSize: 24,
    color: "white"
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 20
  },
  imageBox: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  label: {
    color: "white",
    marginBottom: 5
  },
  input: {
    backgroundColor: "#2c4a6e",
    borderRadius: 8,
    padding: 10,
    color: "white",
    marginBottom: 12
  },
  picker: {
    backgroundColor: "#2c4a6e",
    borderRadius: 8,
    marginBottom: 12
  },
  row: {
    flexDirection: "row",
    marginBottom: 10
  },
  col: {
    flex: 1,
    marginRight: 5
  },
  textArea: {
    backgroundColor: "#2c4a6e",
    borderRadius: 8,
    padding: 10,
    color: "white",
    height: 80,
    textAlignVertical: "top",
    marginBottom: 12
  },
  btn: {
    backgroundColor: "#9ca3af",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40
  },
  btnText: {
    fontWeight: "bold"
  }
});