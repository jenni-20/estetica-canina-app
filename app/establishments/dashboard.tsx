import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function EstablishmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [establishment, setEstablishment] = useState<any>(null);
  
  // Estados para el CRUD (Update/Create)
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchEstablishment();
  }, []);

  const fetchEstablishment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // READ: Buscamos si este usuario ya tiene un establecimiento
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('owner_id', user.id) // Asegúrate que la columna se llame así
        .single();

      if (data) {
        setEstablishment(data);
        setName(data.nombre_negocio);
        setAddress(data.direccion);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    // Aquí iría la lógica del UPSERT (Update o Insert)
    alert("Guardando cambios...");
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de mi Estética ✂️</Text>
      
      <Text style={styles.label}>Nombre del Negocio:</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Ej. Elegancia Canina"
      />

      <Text style={styles.label}>Dirección:</Text>
      <TextInput 
        style={styles.input} 
        value={address} 
        onChangeText={setAddress} 
        placeholder="Calle Central #123"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {establishment ? "Actualizar Datos" : "Registrar Estética"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1e3a5f' },
  title: { fontSize: 24, color: 'white', marginBottom: 20, fontWeight: 'bold' },
  label: { color: 'white', marginTop: 10 },
  input: { backgroundColor: 'white', borderRadius: 5, padding: 10, marginTop: 5 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});