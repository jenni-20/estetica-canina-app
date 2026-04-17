import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function CreateQuote() {

  const [selectedDate, setSelectedDate] = useState("");
  const [rawDate, setRawDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [petName, setPetName] = useState("");

  // 🔥 NUEVO
  const [showSuccess, setShowSuccess] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const servicesList = [
    "Consultas",
    "Consulta de Emergencias",
    "Vacunas",
    "Desparasitación",
    "Esterilización Machos",
    "Esterilización Hembras",
    "Peluquería Completa",
    "Taxi de Mascotas"
  ];

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !rawDate) {
      alert("Completa los campos");
      return;
    }

    const { error } = await supabase.from("quotes").insert([
      {
        date: rawDate,
        status: "PENDING",
        client_id: user.id
      }
    ]);

    if (error) alert(error.message);
    else setShowSuccess(true); // 🔥 modal en vez de alert
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.title}>Agenda tu cita</Text>
        </View>

        <View style={styles.card}>

          <Text style={styles.subtitle}>
            Completa los siguientes campos correctamente:
          </Text>

          <Text style={styles.label}>Nombre del dueño:</Text>
          <TextInput style={styles.input} placeholder="Coloca tu nombre" placeholderTextColor="#ccc" onChangeText={setOwnerName} />

          <Text style={styles.label}>Teléfono:</Text>
          <TextInput style={styles.input} onChangeText={setPhone} />

          <Text style={styles.label}>Nombre de la mascota:</Text>
          <TextInput style={styles.input} onChangeText={setPetName} />

          <Text style={styles.label}>Fecha:</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowCalendar(true)}>
            <Text style={{ color: selectedDate ? "white" : "#ccc" }}>
              {selectedDate || "DD/MM/AA"}
            </Text>
          </TouchableOpacity>

          {showCalendar && (
            <View style={styles.calendarBox}>
              <Calendar
                onDayPress={(day) => {
                  const fecha = new Date(day.dateString);
                  const dia = String(fecha.getDate()).padStart(2, "0");
                  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
                  const anio = fecha.getFullYear();

                  setSelectedDate(`${dia}/${mes}/${anio}`);
                  setRawDate(day.dateString);
                }}
                markedDates={{
                  [rawDate]: { selected: true, selectedColor: "#1e3a5f" }
                }}
              />

              <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowCalendar(false)}>
                <Text style={{ color: "white" }}>Seleccionar día</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 🔥 SERVICIOS NUEVOS */}
          <Text style={styles.label}>Servicios:</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowServices(true)}>
            <Text style={{ color: selectedServices.length ? "white" : "#ccc" }}>
              {selectedServices.length
                ? `${selectedServices.length} seleccionados`
                : "Selecciona servicios"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Agendar cita</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* 🔥 MODAL SERVICIOS */}
      {showServices && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Selecciona Servicios a realizar</Text>

            {servicesList.map((item) => (
              <TouchableOpacity key={item} style={styles.serviceItem} onPress={() => toggleService(item)}>
                <Text>{item}</Text>
                <Text>{selectedServices.includes(item) ? "✔" : ""}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowServices(false)}>
              <Text style={{ color: "white" }}>Guardar servicios</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🔥 MODAL ÉXITO */}
      {showSuccess && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Cita guardada con éxito!!</Text>

            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Puedes ver tus citas pendientes en tu perfil
            </Text>

            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowSuccess(false)}>
              <Text style={{ color: "white" }}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f2a44" },
  scroll: { flexGrow: 1 },

  header: {
    backgroundColor: "#1e3a5f",
    paddingVertical: 25,
    alignItems: "center"
  },

  title: { color: "white", fontSize: 28, fontWeight: "bold" },

  card: {
    flex: 1,
    backgroundColor: "#123a5c",
    paddingTop: 20,
    paddingBottom: 30
  },

  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20
  },

  label: { color: "white", marginLeft: 20, marginBottom: 5 },

  input: {
    backgroundColor: "#2c4a6e",
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: "white"
  },

  calendarBox: {
    marginHorizontal: 20,
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
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  btnText: { fontWeight: "bold", color: "white" },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    width: "85%",
    backgroundColor: "#c7d7e8",
    borderRadius: 20,
    padding: 20
  },

  modalTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold"
  },

  modalBtn: {
    backgroundColor: "#1e3a5f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center"
  },

  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8"
  }
});