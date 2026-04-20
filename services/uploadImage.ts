import { supabase } from "@/lib/supabase";

const uploadImage = async (image: string | null) => {
  if (!image) return null;

  try {
    const fileName = `pet_${Date.now()}.jpg`;

    console.log("Subiendo imagen:", image);

    // 🔥 convertir URI a blob (Expo compatible)
    const response = await fetch(image);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from("pets")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: false
      });

    if (error) {
      console.log("Error al subir:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("pets")
      .getPublicUrl(fileName);

    console.log("URL imagen:", data.publicUrl);

    return data.publicUrl;

  } catch (err) {
    console.log("Error en uploadImage:", err);
    return null;
  }
};