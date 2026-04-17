import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PetProfile() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={28} color="white" />

        {/* ✅ RUTA CORREGIDA */}
        <Image source={require("../../logo.png")} style={styles.logo} />
      </View>

      {/* NOMBRE */}
      <View style={styles.nameBox}>
        <Text style={styles.name}>Nombre_de_Mascota</Text>
      </View>

      {/* FOTO + BOTONES */}
      <View style={styles.topSection}>

        <View style={styles.imageBox}>
          <Image
            source={{ uri: "https://placedog.net/400" }}
            style={styles.image}
          />
        </View>

        <View>
          <TouchableOpacity style={styles.btn}>
            <MaterialIcons name="edit" size={20} color="white" />
            <Text style={styles.btnText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnDelete}>
            <MaterialIcons name="close" size={20} color="white" />
            <Text style={styles.btnText}>Eliminar perfil</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* DATOS */}
      <Text style={styles.label}>Datos de tu mascota:</Text>

      <View style={styles.dataRow}>

        <View style={styles.dataBox}>
          <MaterialIcons name="pets" size={30} color="#0f2a44" />
          <Text>Edad:</Text>
          <Text style={styles.bold}>5 años</Text>
        </View>

        <View style={styles.dataBox}>
          <MaterialIcons name="scale" size={30} color="#0f2a44" />
          <Text>Peso:</Text>
          <Text style={styles.bold}>34 kg</Text>
        </View>

        <View style={styles.dataBox}>
          <MaterialIcons name="medical-services" size={30} color="#0f2a44" />
          <Text style={styles.bold}>Vacunas:</Text>
          <Text>- Rabia{"\n"}- Parvo</Text>
        </View>

      </View>

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

  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  imageBox: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 12,
    padding: 10
  },

  image: {
    width: 150,
    height: 150
  },

  btn: {
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },

  btnDelete: {
    backgroundColor: "#475569",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },

  btnText: {
    color: "white"
  },

  label: {
    color: "white",
    marginBottom: 10
  },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  dataBox: {
    backgroundColor: "#c7d7e8",
    padding: 10,
    borderRadius: 12,
    width: "30%",
    alignItems: "center"
  },

  bold: {
    fontWeight: "bold"
  }
});