import { supabase } from "@/lib/supabase";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function CreateQuote() {

  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [petName, setPetName] = useState("");
  const [service, setService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !selectedDate) {
      alert("Completa los campos");
      return;
    }

    const { error } = await supabase.from("quotes").insert([
      {
        date: selectedDate,
        status: "PENDING",
        client_id: user.id
      }
    ]);

    if (error) alert(error.message);
    else alert("Cita guardada ✅");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.card}>

          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require("../logo.png")} // ✅ CORREGIDO
              style={styles.logo}
            />
          </View>

          {/* TÍTULO */}
          <Text style={styles.title}>Agenda tu cita</Text>

          <Text style={styles.subtitle}>
            Completa los siguientes campos correctamente:
          </Text>

          {/* INPUTS */}
          <Text style={styles.label}>Nombre del dueño de la mascota:</Text>
          <TextInput
            style={styles.input}
            placeholder="Coloca tu nombre"
            placeholderTextColor="#ccc"
            onChangeText={setOwnerName}
          />

          <Text style={styles.label}>Teléfono:</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Nombre de la mascota:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPetName}
          />

          {/* FECHA */}
          <Text style={styles.label}>Fecha para la cita:</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={{ color: selectedDate ? "white" : "#ccc" }}>
              {selectedDate || "DD/MM/AA"}
            </Text>
          </TouchableOpacity>

          {showCalendar && (
            <View style={styles.calendarBox}>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: "#1e3a5f"
                  }
                }}
              />

              <TouchableOpacity
                style={styles.calendarBtn}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={{ color: "white" }}>Seleccionar día</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* SERVICIOS */}
          <Text style={styles.label}>Servicios a realizar:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={service}
              onValueChange={(value) => setService(value)}
            >
              <Picker.Item label="Selecciona..." value="" />
              <Picker.Item label="Baño" value="bano" />
              <Picker.Item label="Corte" value="corte" />
              <Picker.Item label="Uñas" value="unas" />
              <Picker.Item label="Vacunas" value="vacunas" />
              <Picker.Item label="Desparasitación" value="desparasitacion" />
            </Picker>
          </View>

          {/* BOTÓN */}
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Agenda tu cita:</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f2a44"
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#123a5c",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    paddingBottom: 20
  },
  header: {
    backgroundColor: "#1e3a5f",
    alignItems: "center",
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  title: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
    marginTop: 10
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20
  },
  label: {
    color: "white",
    marginLeft: 15,
    marginBottom: 5
  },
  input: {
    backgroundColor: "#2c4a6e",
    marginHorizontal: 15,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: "white"
  },
  picker: {
    backgroundColor: "#2c4a6e",
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  calendarBox: {
    marginHorizontal: 15,
    backgroundColor: "#a9c0d6",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15
  },
  calendarBtn: {
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  btn: {
    backgroundColor: "#9ca3af",
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  btnText: {
    fontWeight: "bold"
  }
});