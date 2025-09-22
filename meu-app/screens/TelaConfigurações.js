import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaConfiguracoes({ route, navigation }) {
  const { cultivo } = route.params;
  const [cultivoData, setCultivoData] = useState(cultivo);

  // excluir cultivo
  const excluirCultivo = async () => {
    Alert.alert(
      "Excluir cultivo",
      "Tem certeza que deseja excluir este cultivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from('cultivo').delete().eq('id', cultivo.id);
            if (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível excluir o cultivo.");
            } else {
              Alert.alert("Sucesso", "Cultivo excluído!");
              navigation.navigate('TelaPrincipal'); // volta pra principal
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurações</Text>
      <View style={styles.linha} />

      <Text style={styles.info}>Cultivo: {cultivoData.nome}</Text>
      <Text style={styles.info}>Safra: {cultivoData.safra || 'Não informada'}</Text>

      <TouchableOpacity
        style={[styles.botao, styles.editar]}
        onPress={() => navigation.navigate('CadastroCultivo', { cultivo: cultivoData })}
      >
        <Text style={styles.textoBotao}>Editar Cultivo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, styles.excluir]}
        onPress={excluirCultivo}
      >
        <Text style={styles.textoBotao}>Excluir Cultivo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3eedc', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  linha: { height: 1, backgroundColor: '#000', marginVertical: 10 },
  info: { fontSize: 16, marginVertical: 5 },
  botao: {
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  editar: { backgroundColor: '#ffd54f' },
  excluir: { backgroundColor: '#e57373' },
  textoBotao: { fontSize: 16, fontWeight: '600', color: '#000' },
});
