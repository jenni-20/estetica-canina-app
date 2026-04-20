import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function EstablishmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [establishment, setEstablishment] = useState<any>(null);

  // ✅ Ejemplo cargado por defecto
  const [name, setName] = useState('Elegancia Canina');
  const [address, setAddress] = useState('Calle Central #123');
  const [establishmentNumber, setEstablishmentNumber] = useState('001');

  // ✅ Servicios
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetchEstablishment();
    fetchServices();
  }, []);

  const fetchEstablishment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('establishments')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (data) {
        setEstablishment(data);
        setName(data.nombre_negocio || 'Elegancia Canina');
        setAddress(data.direccion || 'Calle Central #123');
        setEstablishmentNumber(data.numero_establecimiento || '001');
      }
    }
    setLoading(false);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, description, price');

    if (error) {
      console.log(error);
      alert("Error cargando servicios");
      return;
    }
    setServices(data || []);
  };

  const handleNavigateToQuote = () => {
    if (establishment) {
      router.push({
        pathname: '/(tabs)/quotes/QuoteDetail', // ✅ ahora apunta a la pantalla de detalle
        params: {
          petName: "Firulais",
          ownerName: "Juan Pérez",
          date: "20/04/2026",
          services: "Vacunas, peluquería"
        }
      });
    } else {
      alert("Primero registra tu establecimiento");
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Image source={require('../logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Panel de mi Estética ✂️</Text>
      
      <Text style={styles.label}>Nombre del Negocio:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Dirección:</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Foto del Establecimiento:</Text>
      <Image 
        source={require('../../assets/images/vet_placeholder.jpg')} 
        style={styles.establishmentPhoto} 
      />

      <Text style={styles.label}>Número de Establecimiento:</Text>
      <TextInput 
        style={styles.input} 
        value={establishmentNumber} 
        onChangeText={setEstablishmentNumber} 
        keyboardType="numeric"
      />

      {/* ✅ Lista de servicios */}
      <Text style={styles.label}>Tipos de Servicios:</Text>
      {services.length > 0 ? (
        services.map((s) => (
          <View key={s.id} style={styles.serviceBox}>
            <Text style={styles.serviceName}>{s.name}</Text>
            <Text style={styles.serviceDesc}>{s.description}</Text>
            <Text style={styles.servicePrice}>${s.price}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: 'white', marginTop: 5 }}>No hay servicios registrados</Text>
      )}

      {/* ✅ Botón siempre visible al final */}
      <TouchableOpacity style={styles.button} onPress={handleNavigateToQuote}>
        <Text style={styles.buttonText}>Agendar cita en este establecimiento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, backgroundColor: '#1e3a5f' },
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 100, height: 100, borderRadius: 50 },
  title: { fontSize: 24, color: 'white', marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  label: { color: 'white', marginTop: 10 },
  input: { backgroundColor: 'white', borderRadius: 5, padding: 10, marginTop: 5 },
  establishmentPhoto: { width: '100%', height: 200, marginTop: 10, borderRadius: 10 },
  serviceBox: { backgroundColor: '#2c4a6e', padding: 10, borderRadius: 8, marginTop: 10 },
  serviceName: { color: 'white', fontWeight: 'bold' },
  serviceDesc: { color: '#ccc', fontSize: 12 },
  servicePrice: { color: '#4CAF50', fontWeight: 'bold', marginTop: 5 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, marginTop: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' }
});
