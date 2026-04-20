import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QuoteDetail() {
  const { petName, ownerName, date, services } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Image source={require('../../logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Bienvenid@</Text>
      <Text style={styles.subtitle}>Nombre_Usuario1</Text>

      <Text style={styles.sectionTitle}>Cita próxima:</Text>

      <Text style={styles.detail}>Para quien: {petName || "Nombre de la mascota"}</Text>
      <Text style={styles.detail}>De quien: {ownerName || "Dueño de la mascota"}</Text>
      <Text style={styles.detail}>Día de la cita: {date || "DD/MM/AA"}</Text>
      <Text style={styles.detail}>Servicios a realizar: {services || "Vacunas, peluquería..."}</Text>

      {/* Botones personalizados */}
      <TouchableOpacity style={styles.acceptBtn} onPress={() => alert("Cita aceptada")}>
        <Text style={styles.btnText}>Aceptar cita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rejectBtn} onPress={() => alert("Cita rechazada")}>
        <Text style={styles.btnText}>Rechazar cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f2a44', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 90, height: 90, borderRadius: 50 },
  title: { color: 'white', fontSize: 28, textAlign: 'center', marginBottom: 5 },
  subtitle: { color: '#ccc', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { color: 'white', fontSize: 20, marginBottom: 10 },
  detail: { color: 'white', marginBottom: 8 },
  acceptBtn: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 10, marginTop: 20 },
  rejectBtn: { backgroundColor: '#ef4444', padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', textAlign: 'center' }
});
