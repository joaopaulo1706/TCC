import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../config/supabaseClient";

export default function AlterarFoto({ navigation }) {
  const [foto, setFoto] = useState(null);

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const salvarFoto = async () => {
    if (!foto) {
      Alert.alert("Erro", "Nenhuma foto selecionada.");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("Usuário não encontrado");

      // Nome do arquivo (id do usuário garante unicidade)
      const filePath = `perfil/${user.id}.jpg`;

      // Upload direto para o Supabase via fetch
      const fotoBase64 = await FileSystem.readAsStringAsync(foto, { encoding: "base64" });
      const fotoBuffer = new Uint8Array(
        atob(fotoBase64)
          .split("")
          .map((c) => c.charCodeAt(0))
      );

      const { error: uploadError } = await supabase.storage
        .from("perfil")
        .upload(filePath, fotoBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // URL pública
      const { data } = supabase.storage.from("perfil").getPublicUrl(filePath);
      const fotoUrl = data.publicUrl;

      // Atualiza no user_metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { foto_url: fotoUrl },
      });

      if (updateError) throw updateError;

      Alert.alert("Sucesso", "Foto atualizada com sucesso!");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível salvar a foto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alterar foto</Text>
      <View style={styles.linha} />

      {foto ? (
        <Image source={{ uri: foto }} style={styles.foto} />
      ) : (
        <View style={styles.placeholder}>
          <Text>Nenhuma foto selecionada</Text>
        </View>
      )}

      <TouchableOpacity style={styles.botao} onPress={escolherFoto}>
        <Text style={styles.textoBotao}>Adicionar Arquivo</Text>
      </TouchableOpacity>

      <View style={styles.botoes}>
        <TouchableOpacity style={[styles.botao, styles.cancelar]} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, styles.salvar]} onPress={salvarFoto}>
          <Text style={styles.textoBotao}>Concluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3eedc", padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  linha: { height: 1, backgroundColor: "#000", marginVertical: 10 },
  foto: { width: 120, height: 120, borderRadius: 60, alignSelf: "center", marginBottom: 15 },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  botoes: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  botao: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#E6DBB9",
  },
  cancelar: { backgroundColor: "#e57373" },
  salvar: { backgroundColor: "#81c784" },
  textoBotao: { fontWeight: "600", color: "#000" },
});
