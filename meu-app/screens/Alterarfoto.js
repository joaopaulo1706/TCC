import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabaseClient';

export default function AlterarFoto({ navigation }) {
  const [foto, setFoto] = useState(null);

  // Escolher imagem
  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // Salvar foto no Supabase
  const salvarFoto = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      if (!foto) {
        Alert.alert("Erro", "Selecione uma foto primeiro!");
        return;
      }

      // Converte URI para ArrayBuffer
      const response = await fetch(foto);
      const arrayBuffer = await response.arrayBuffer();
      const file = new Uint8Array(arrayBuffer); // 🔑 Supabase aceita Uint8Array

      // Nome único do arquivo
      const fileName = `${user.id}-${Date.now()}.jpg`;

      // Upload no bucket avatars
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        Alert.alert("Erro", "Falha ao enviar a foto.");
        return;
      }

      // Pega URL pública
      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const fotoUrl = publicUrl.publicUrl;

      // Atualiza o perfil do usuário
      const { error: updateError } = await supabase.auth.updateUser({
        data: { foto: fotoUrl },
      });

      if (updateError) {
        console.error(updateError);
        Alert.alert("Erro", "Não foi possível atualizar o perfil.");
      } else {
        Alert.alert("Sucesso", "Foto atualizada!");
        navigation.goBack();
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Algo deu errado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alterar foto</Text>
      <View style={styles.linha} />

      {/* Quadrado para mostrar a foto */}
      <TouchableOpacity style={styles.caixaFoto} onPress={escolherFoto}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} />
        ) : (
          <Text style={styles.placeholderText}>Adicionar Arquivo</Text>
        )}
      </TouchableOpacity>

      <View style={styles.botoes}>
        <TouchableOpacity
          style={[styles.botao, styles.cancelar]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botao, styles.salvar]}
          onPress={salvarFoto}
        >
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
  caixaFoto: {
    width: "100%",
    height: 200,
    backgroundColor: "#E6DBB9",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  foto: { width: "100%", height: "100%", borderRadius: 6 },
  placeholderText: { color: "#333", fontSize: 16 },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  botao: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelar: { backgroundColor: "#e57373" },
  salvar: { backgroundColor: "#81c784" },
  textoBotao: { fontWeight: "600", color: "#fff" },
});
