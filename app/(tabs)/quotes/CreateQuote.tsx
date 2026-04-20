import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// 🌎 ESPAÑOL
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ],
  monthNamesShort: [
    'Ene','Feb','Mar','Abr','May','Jun',
    'Jul','Ago','Sep','Oct','Nov','Dic'
  ],
  dayNames: [
    'Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'
  ],
  dayNamesShort: [
    'Dom','Lun','Mar','Mié','Jue','Vie','Sáb'
  ],
  today: 'Hoy'
};

LocaleConfig.defaultLocale = 'es';

export default function CreateQuote() {

  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [petName, setPetName] = useState("");

  const [date, setDate] = useState("");
  const [isoDate, setIsoDate] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);

  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showServices, setShowServices] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  // 🔥 CARGAR SERVICIOS
  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*');

    if (error) {
      alert("Error cargando servicios");
      return;
    }

    setServices(data || []);
  };

  // 🔥 SELECCIONAR SERVICIO
  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // 📅 FORMATO FECHA
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // 💾 GUARDAR CITA
  const saveQuote = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!isoDate || selectedServices.length === 0) {
      alert("Selecciona fecha y servicios");
      return;
    }

    for (const serviceId of selectedServices) {
      await supabase.from('quotes').insert([
        {
          service_id: serviceId,
          date: isoDate,
          client_id: user?.id,
          status: "pending"
        }
      ]);
    }

    setShowSuccess(true);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require('../../logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Agenda tu cita</Text>
      <Text style={styles.subtitle}>
        Completa los siguientes campos correctamente:
      </Text>

      {/* INPUTS */}
      <Text style={styles.label}>Nombre del dueño:</Text>
      <TextInput
        style={styles.input}
        value={owner}
        onChangeText={setOwner}
      />

      <Text style={styles.label}>Teléfono:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Nombre de la mascota:</Text>
      <TextInput
        style={styles.input}
        value={petName}
        onChangeText={setPetName}
      />

      {/* FECHA */}
      <Text style={styles.label}>Fecha:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowCalendar(true)}
      >
        <Text style={{ color: '#ccc' }}>
          {date || "DD/MM/AAAA"}
        </Text>
      </TouchableOpacity>

      {/* SERVICIOS */}
      <Text style={styles.label}>Servicios:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowServices(true)}
      >
        <Text style={{ color: '#ccc' }}>
          {selectedServices.length > 0
            ? `${selectedServices.length} seleccionados`
            : "Selecciona servicios"}
        </Text>
      </TouchableOpacity>

      {/* BOTÓN */}
      <TouchableOpacity style={styles.btn} onPress={saveQuote}>
        <Text style={styles.btnText}>Agendar cita</Text>
      </TouchableOpacity>

      {/* 📅 CALENDARIO */}
      <Modal visible={showCalendar} transparent>
        <View style={styles.modal}>
          <View style={styles.modalBox}>
            <Calendar
              onDayPress={(day) => {
                setDate(formatDate(day.dateString));
                setIsoDate(new Date(day.dateString).toISOString());
                setShowCalendar(false);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* 📋 SERVICIOS */}
      <Modal visible={showServices} transparent>
        <View style={styles.modal}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Selecciona servicios
            </Text>

            <ScrollView>
              {services.map((s) => {
                const selected = selectedServices.includes(s.id);

                return (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.serviceRow}
                    onPress={() => toggleService(s.id)}
                  >
                    <Text style={styles.serviceText}>{s.name}</Text>
                    <Text>{selected ? "✔️" : "○"}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.btnSmall}
              onPress={() => setShowServices(false)}
            >
              <Text style={{ color: 'white' }}>Guardar servicios</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* 🎉 MODAL ÉXITO */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.successBox}>

            <Text style={styles.successTitle}>
              Cita guardada con éxito!!
            </Text>

            <Text style={styles.successText}>
              Puedes ver tus citas pendientes en tu perfil
            </Text>

            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => {
                setShowSuccess(false);

                // limpiar
                setOwner("");
                setPhone("");
                setPetName("");
                setDate("");
                setSelectedServices([]);

                // regresar a home
                router.replace('/home');
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Aceptar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f2a44', padding: 20 },
  header: { alignItems: 'center', marginTop: 20 },
  logo: { width: 90, height: 90, borderRadius: 50 },
  title: { color: 'white', fontSize: 30, textAlign: 'center' },
  subtitle: { color: '#ccc', textAlign: 'center' },
  label: { color: 'white', marginTop: 10 },
  input: { backgroundColor: '#2c4a6e', padding: 12, borderRadius: 8, marginTop: 5 },
  btn: { backgroundColor: '#9ca3af', padding: 15, borderRadius: 10, marginTop: 20 },
  btnText: { textAlign: 'center', fontWeight: 'bold' },

  modal: { flex: 1, justifyContent: 'center', backgroundColor: '#000000aa' },
  modalBox: { backgroundColor: 'white', margin: 20, borderRadius: 15, padding: 20, maxHeight: 400 },
  modalTitle: { textAlign: 'center', marginBottom: 10 },

  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  serviceText: { color: '#1e3a5f' },

  btnSmall: {
    backgroundColor: '#1e3a5f',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },

  successBox: {
    backgroundColor: '#cbd5e1',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  successText: {
    textAlign: 'center',
    marginBottom: 15
  },
  successBtn: {
    backgroundColor: '#1e3a5f',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  }
});