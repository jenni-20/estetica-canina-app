import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function UserDashboard() {

  const [user, setUser] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;
    setUser(currentUser);

    if (!currentUser) return;

    const { data } = await supabase
      .from('quotes')
      .select(`
        id,
        date,
        pets:pet_id ( name ),
        services:service_id ( name )
      `)
      .eq('client_id', currentUser.id)
      .order('date', { ascending: true });

    setQuotes(data || []);
  };

  // ❌ CANCELAR
  const cancelQuote = (id: string) => {
    Alert.alert("Cancelar cita", "¿Seguro?", [
      { text: "No" },
      {
        text: "Sí",
        onPress: async () => {
          await supabase.from('quotes').delete().eq('id', id);
          loadData();
        }
      }
    ]);
  };

  // 🔄 REPROGRAMAR
  const rescheduleQuote = async (id: string) => {
    const nuevaFecha = new Date();
    nuevaFecha.setDate(nuevaFecha.getDate() + 1);

    await supabase
      .from('quotes')
      .update({ date: nuevaFecha.toISOString() })
      .eq('id', id);

    Alert.alert("Cita reprogramada");
    loadData();
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Citas próximas</Text>

      {quotes.length === 0 && (
        <Text style={styles.empty}>No tienes citas</Text>
      )}

      {quotes.map((q) => (
        <View key={q.id} style={styles.card}>

          <View style={styles.rowText}>
            <Text style={styles.label}>Para quien:</Text>
            <Text style={styles.value}>{q.pets?.name}</Text>
          </View>

          <View style={styles.rowText}>
            <Text style={styles.label}>Día de la cita:</Text>
            <Text style={styles.value}>
              {new Date(q.date).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.rowText}>
            <Text style={styles.label}>Servicio:</Text>
            <Text style={styles.value}>{q.services?.name}</Text>
          </View>

          <View style={styles.buttons}>

            <TouchableOpacity
              style={styles.btnBlue}
              onPress={() => rescheduleQuote(q.id)}
            >
              <Text style={styles.btnText}>Reprogramar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnRed}
              onPress={() => cancelQuote(q.id)}
            >
              <Text style={styles.btnText}>Cancelar cita</Text>
            </TouchableOpacity>

          </View>

        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2a44',
    padding: 15
  },

  title: {
    color: 'white',
    fontSize: 22,
    marginBottom: 10
  },

  empty: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20
  },

  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },

  rowText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },

  label: {
    color: '#ccc'
  },

  value: {
    color: 'white'
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  btnBlue: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center'
  },

  btnRed: {
    backgroundColor: '#dc2626',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center'
  },

  btnText: {
    color: 'white',
    fontWeight: 'bold'
  }
});