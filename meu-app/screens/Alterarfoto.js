import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabaseClient';

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // salva no user_metadata
    const { error } = await supabase.auth.updateUser({
      data: { foto: foto },
    });

    if (error) {
      console.error(error);
      alert("Erro ao salvar foto");
    } else {
      alert("Foto alterada com sucesso!");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alterar foto</Text>
      <View style={styles.linha} />

      {/* Quadrado grande */}
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
  container: { flex: 1, backgroundColor: '#f3eedc', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  linha: { height: 1, backgroundColor: '#000', marginVertical: 10 },
  caixaFoto: {
    width: '100%',
    height: 200,
    backgroundColor: '#E6DBB9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  foto: { width: '100%', height: '100%', borderRadius: 6 },
  placeholderText: { color: '#333', fontSize: 16 },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  botao: { flex: 1, padding: 15, marginHorizontal: 5, borderRadius: 6, alignItems: 'center' },
  cancelar: { backgroundColor: '#e57373' },
  salvar: { backgroundColor: '#81c784' },
  textoBotao: { fontWeight: '600', color: '#fff' },
});
