import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function Home() {

  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [pets, setPets] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);

  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [newDate, setNewDate] = useState(new Date().toISOString());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;
    setUser(currentUser);

    if (!currentUser) return;

    const { data: petsData } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', currentUser.id);

    setPets(petsData || []);

    const { data: quotesData } = await supabase
      .from('quotes')
      .select('*')
      .eq('client_id', currentUser.id);

    setQuotes(quotesData || []);
  };

  return (
    <View style={{ flex: 1 }}>

      <ScrollView style={{ flex: 1, backgroundColor: '#0f2a44' }}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MaterialIcons name="menu" size={30} color="white" />
          </TouchableOpacity>

          <Image
            source={require('./logo.png')}
            style={styles.logo}
          />

          <View style={{ width: 28 }} />
        </View>

        {/* BIENVENIDA */}
        <Text style={styles.title}>
          Bienvenid@
        </Text>

        {/* USUARIO */}
        <View style={styles.userBox}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            👤 {user?.email || "Cargando..."}
          </Text>
        </View>

        {/* MASCOTAS */}
        <Text style={styles.sectionTitle}>Tus mascotas:</Text>

        <ScrollView horizontal style={{ paddingLeft: 20 }}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.petCard}
              // 🔥 Agregamos la navegación aquí:
              onPress={() => router.push(`/(tabs)/pets/${pet.id}`)}
            >
              <Image
                source={{ uri: pet.image_url }}
                style={styles.petImage}
              />
              <Text style={{ color: 'white' }}>{pet.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CITAS */}
        <Text style={styles.sectionTitle}>Citas próximas:</Text>

        {quotes.map((q) => (
          <View key={q.id} style={styles.card}>
            <Text style={{ color: 'white' }}>
              📅 {new Date(q.date).toLocaleDateString()}
            </Text>

            <Text style={{ color: 'white' }}>
              Estado: {q.status}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity
                style={styles.btnBlue}
                onPress={() => {
                  setSelectedQuote(q);
                  setShowEditModal(true);
                }}
              >
                <Text style={{ color: 'white' }}>Reprogramar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnRed}
                onPress={() => {
                  setSelectedQuote(q);
                  setShowDeleteModal(true);
                }}
              >
                <Text style={{ color: 'white' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* MENU */}
      {menuVisible && (
        <View style={styles.menu}>

          <TouchableOpacity
            onPress={() => setMenuVisible(false)}
            style={{ marginTop: 40 }}
          >
            <MaterialIcons name="close" size={25} color="white" />
          </TouchableOpacity>

          <View style={{ marginTop: 30 }}>
            <MenuItem icon="event" text="Agenda una cita" route="/(tabs)/quotes/CreateQuote" closeMenu={() => setMenuVisible(false)} />
            <MenuItem icon="pets" text="Registra una mascota" route="/(tabs)/pets/CreatePet" closeMenu={() => setMenuVisible(false)} />
            <MenuItem icon="person" text="Ver perfil" route="/(tabs)/profile" closeMenu={() => setMenuVisible(false)} />
          </View>

          {/* 🔥 CERRAR SESIÓN */}
          <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 40 }}>
            <TouchableOpacity
              onPress={async () => {
                await supabase.auth.signOut();
                router.replace('/auth/login');
              }}
              style={styles.logout}
            >
              <MaterialIcons name="logout" size={22} color="white" />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}

      {/* MODAL ELIMINAR */}
      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>¿Cancelar cita?</Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.btnBlue}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={{ color: 'white' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnGreen}
                onPress={async () => {
                  await supabase.from('quotes').delete().eq('id', selectedQuote.id);
                  setShowDeleteModal(false);
                  setShowSuccessModal(true);
                  loadData();
                }}
              >
                <Text style={{ color: 'white' }}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* MODAL EDITAR (DISEÑO BONITO) */}
      {showEditModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.editBox}>

            <Text style={styles.editTitle}>
              Selecciona los datos a cambiar
            </Text>

            <Text style={styles.label}>Fecha para la cita:</Text>

            <TouchableOpacity style={styles.input}>
              <Text style={{ color: '#cbd5e1' }}>
                {new Date(newDate).toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Servicios a realizar:</Text>
            <View style={styles.input} />

            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <TouchableOpacity
                style={styles.btnBlue}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={{ color: 'white' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnGreen}
                onPress={async () => {
                  await supabase
                    .from('quotes')
                    .update({ date: newDate })
                    .eq('id', selectedQuote.id);

                  setShowEditModal(false);
                  setShowSuccessModal(true);
                  loadData();
                }}
              >
                <Text style={{ color: 'white' }}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      )}

      {/* MODAL EXITO */}
      {showSuccessModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.successBox}>

            <Text style={styles.successTitle}>
              Cita actualizada con éxito!!
            </Text>

            <Text style={styles.successText}>
              Puedes ver tus citas pendientes en tu perfil
            </Text>

            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successBtnText}>
                Aceptar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

    </View>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1e3a5f'
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 35
  },

  title: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center'
  },

  userBox: {
    backgroundColor: '#e5e7eb',
    margin: 20,
    padding: 10,
    borderRadius: 20
  },

  sectionTitle: {
    color: 'white',
    marginLeft: 20
  },

  petCard: {
    marginRight: 10
  },

  petImage: {
    width: 100,
    height: 100
  },

  card: {
    backgroundColor: '#1e3a5f',
    margin: 20,
    padding: 15,
    borderRadius: 20
  },

  btnBlue: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 10,
    marginRight: 5
  },

  btnRed: {
    backgroundColor: '#b91c1c',
    padding: 10,
    borderRadius: 10
  },

  btnGreen: {
    backgroundColor: '#166534',
    padding: 10,
    borderRadius: 10,
    marginLeft: 5
  },

  menu: {
    position: 'absolute',
    width: 260,
    height: '100%',
    backgroundColor: '#1e3a5f',
    padding: 20
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  logoutText: {
    color: 'white',
    marginLeft: 10
  },

  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000aa',
    justifyContent: 'center'
  },

  modal: {
    backgroundColor: '#cbd5e1',
    margin: 20,
    padding: 20,
    borderRadius: 20
  },

  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10
  },

  editBox: {
    backgroundColor: '#94a3b8',
    margin: 20,
    padding: 20,
    borderRadius: 20
  },

  editTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },

  label: {
    marginTop: 10
  },

  input: {
    backgroundColor: '#64748b',
    padding: 10,
    borderRadius: 10,
    marginTop: 5
  },

  successBox: {
    backgroundColor: '#cbd5e1',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center'
  },

  successTitle: {
    fontSize: 22,
    fontWeight: 'bold'
  },

  successText: {
    textAlign: 'center',
    marginVertical: 10
  },

  successBtn: {
    backgroundColor: '#475569',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },

  successBtnText: {
    color: 'white'
  }
});

const MenuItem = ({ icon, text, route, closeMenu }: any) => (
  <TouchableOpacity
    onPress={() => {
      closeMenu();
      router.push(route);
    }}
    style={{ flexDirection: 'row', paddingVertical: 10 }}
  >
    <MaterialIcons name={icon} size={22} color="white" />
    <Text style={{ color: 'white', marginLeft: 10 }}>{text}</Text>
  </TouchableOpacity>
);