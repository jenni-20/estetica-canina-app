import { supabase } from "@/lib/supabase";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// Imagen por defecto si no hay URL en la base de datos
const DEFAULT_IMAGE = require("../../../assets/images/image.png");

export default function PetProfile() {
    const { id } = useLocalSearchParams();
    const [pet, setPet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const { data, error } = await supabase
                    .from("pets")
                    .select("*")
                    .eq("id", id)
                    .single();
                
                if (error) throw error;
                setPet(data);
            } catch (err) {
                console.error("Error al obtener mascota:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPet();
    }, [id]);

    const confirmDelete = () => {
        Alert.alert(
            "Eliminar Mascota",
            "¿Estás seguro de que deseas eliminar este perfil? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        const { error } = await supabase.from("pets").delete().eq("id", pet.id);
                        if (!error) router.replace("/home");
                    } 
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#B0C4DE" />
            </View>
        );
    }

    if (!pet) return (
        <View style={[styles.container, { justifyContent: 'center' }]}>
            <Text style={{ color: 'white', textAlign: 'center' }}>No se encontró la mascota.</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-circle" size={55} color="#B0C4DE" />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <Image source={require("../../logo.png")} style={styles.logo} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Nombre */}
                <View style={styles.nameCard}>
                    <Text style={styles.petName}>{pet.name || "Sin Nombre"}</Text>
                </View>

                {/* Imagen y Acciones */}
                <View style={styles.middleSection}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={pet.image_url ? { uri: pet.image_url } : DEFAULT_IMAGE}
                            style={styles.petImage}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push({ pathname: "/pets/EditPet", params: { id: pet.id } })}
                        >
                            <MaterialCommunityIcons name="pencil-box-outline" size={45} color="#1A3A5A" />
                            <Text style={styles.actionText}>Editar perfil de mascota</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={confirmDelete}>
                            <Ionicons name="close-circle-outline" size={45} color="#1A3A5A" />
                            <Text style={styles.actionText}>Eliminar perfil de mascota</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Datos */}
                <Text style={styles.sectionTitle}>Datos de tu mascota:</Text>
                <View style={styles.outerDataContainer}>
                    <View style={styles.innerDataContainer}>
                        <View style={styles.infoBox}>
                            <MaterialCommunityIcons name="dog-side" size={40} color="#1A3A5A" />
                            <Text style={styles.infoLabel}>Edad:</Text>
                            <Text style={styles.infoValue}>{pet.age || "---"}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <FontAwesome5 name="weight-hanging" size={28} color="#1A3A5A" />
                            <Text style={styles.infoLabel}>Peso:</Text>
                            <Text style={styles.infoValue}>{pet.weight ? `${pet.weight} kg` : "---"}</Text>
                        </View>

                        <View style={[styles.infoBox, { flex: 1.2 }]}>
                            <MaterialCommunityIcons name="needle" size={35} color="#1A3A5A" />
                            <Text style={styles.vaccineTitle}>Esquema de vacunación:</Text>
                            <Text style={styles.vaccineText}>
                                {pet.vaccines || "No registradas"}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footerBar} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A2540",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: '#153450', // Fondo ligeramente más claro para el encabezado superior
        paddingBottom: 10,
    },
    backButton: {
        zIndex: 10,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        marginRight: 50,
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#B0C4DE',
        backgroundColor: 'white'
    },
    scrollContent: {
        padding: 20,
    },
    nameCard: {
        backgroundColor: "#D9E2EC",
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#B0C4DE',
    },
    petName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A3A5A',
        fontFamily: 'serif',
    },
    middleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        height: 250, // Ajustamos altura fija para que coincida con la imagen
    },
    imageWrapper: {
        width: '62%',
        height: '100%',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#B0C4DE',
        overflow: 'hidden',
    },
    petImage: {
        width: '100%',
        height: '100%',
    },
    actionButtons: {
        width: '35%',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: '#D9E2EC',
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        height: '47%',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#B0C4DE',
    },
    actionText: {
        fontSize: 11,
        textAlign: 'center',
        color: '#1A3A5A',
        fontWeight: 'bold',
        marginTop: 5,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    outerDataContainer: {
        borderWidth: 2,
        borderColor: '#B0C4DE',
        borderRadius: 20,
        padding: 10,
    },
    innerDataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    infoBox: {
        backgroundColor: '#D9E2EC',
        borderRadius: 15,
        padding: 10,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2, // Añade separación entre los cuadros
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A3A5A',
        marginTop: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A3A5A',
    },
    vaccineTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1A3A5A',
        textAlign: 'center',
    },
    vaccineText: {
        fontSize: 9,
        color: '#1A3A5A',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    footerBar: {
        height: 50,
        backgroundColor: '#2A455E',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    }
});