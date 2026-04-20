import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Buffer } from "buffer";
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

global.Buffer = global.Buffer || Buffer;

const defaultImage = require("../../../assets/images/image.png");

export default function CreatePet() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breeds, setBreeds] = useState<any[]>([]);
  const [breedId, setBreedId] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [allergies, setAllergies] = useState("");
  const [vaccines, setVaccines] = useState("");
  const [weight, setWeight] = useState("");

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ← vuelve a usar esta opción
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

      // 1. Obtener la respuesta del archivo local
      const response = await fetch(image);
      // 2. Convertir a Blob
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from("pets")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        console.log("Error detallado de Supabase:", error);
        return null;
      }

      const { data } = supabase.storage.from("pets").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.log("Error de red/conversión:", err);
      return null;
    }
  };

  // 🔥 GUARDAR
  const handleSave = async () => {
    if (!name || !age || !sex || !species) {
      alert("Completa los campos obligatorios");
      return;
    }

    // 1. Subir imagen primero
    const imageUrl = await uploadImage();

    if (image && !imageUrl) {
      alert("Error al subir la imagen. Revisa tu conexión.");
      return; // Se detiene aquí si la imagen falló pero habías seleccionado una
    }

    // 2. Guardar en la base de datos
    const { error } = await supabase.from("pets").insert([
      {
        name,
        age: parseInt(age),
        sex,
        allergies, // Se guarda como texto simple
        vaccines,
        breed_id: breedId ? parseInt(breedId) : null,
        owner_id: (await supabase.auth.getUser()).data.user?.id,
        image_url: imageUrl
      }
    ]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("¡Guardado con éxito! ✅");
      // 3. REDIRECCIÓN FINAL
      router.replace("/home");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* HEADER */}
      <View style={styles.headerContainer}>

        {/* Botón de flecha: Te lleva atrás */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={35} color="white" />
        </TouchableOpacity>

        {/* ✅ Botón de Logo: Ahora al presionarlo te dirige al Home */}
        <View style={styles.logoCenteringWrapper}>
          <TouchableOpacity onPress={() => router.replace("/home")}>
            <Image
              source={require("../../logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

      </View>

      {/* IMAGEN */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image
            source={
              image ? { uri: image } : currentImage ? { uri: currentImage } : defaultImage
            }
            style={styles.image}
            resizeMode="cover" // ✅ Esto evita que la imagen se salga o se deforme
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

        {/* PESO */}
        <View style={styles.col}>
          <Text style={styles.label}>Peso (kg):</Text>
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#ccc"
            keyboardType="decimal-pad" // Importante para que salga el punto decimal
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
          />
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
  headerContainer: {
    height: 180, // Un poco más de altura para que se vea "más abajo" como pediste
    paddingTop: 40, // ✅ Baja ambos elementos significativamente
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#1e3a5f',
    position: 'relative',
    zIndex: 10,
  },

  logoCenteringWrapper: {
    position: 'absolute',
    top: 60, // ✅ Debe coincidir con el paddingTop del headerContainer
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // Eliminamos pointerEvents="none" para que el logo sea clickeable
  },

  headerLogo: {
    width: 100, // ✅ Logo más grande según tu petición
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)', // Un borde sutil para que resalte más
  },

  backButton: {
    zIndex: 20, // Asegura que la flecha esté por encima del wrapper del logo
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
  image: {
    width: 220,
    height: 220
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