import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function AlterarNome({ navigation }) {
  const [novoNome, setNovoNome] = useState('');
  const [confirmarNome, setConfirmarNome] = useState('');

  const salvar = async () => {
    if (novoNome.trim() === '' || confirmarNome.trim() === '') {
      Alert.alert("Erro", "Preencha os dois campos!");
      return;
    }

    if (novoNome !== confirmarNome) {
      Alert.alert("Erro", "Os nomes não coincidem!");
      return;
    }

    // pega o usuário logado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    // atualiza na tabela "productor" (ajusta se tua tabela de usuário tiver outro nome)
    const { error } = await supabase
      .from('productor')
      .update({ nome: novoNome })
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    } else {
      Alert.alert("Sucesso", "Nome alterado com sucesso!");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alterar nome</Text>
      <View style={styles.linha} />

      <Text>Alterar Nome:</Text>
      <TextInput
        style={styles.input}
        value={novoNome}
        onChangeText={setNovoNome}
      />

      <Text>Confirmar Nome:</Text>
      <TextInput
        style={styles.input}
        value={confirmarNome}
        onChangeText={setConfirmarNome}
      />

      <View style={styles.botoes}>
        <TouchableOpacity style={[styles.botao, styles.cancelar]} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, styles.salvar]} onPress={salvar}>
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  botao: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelar: { backgroundColor: '#e57373' },
  salvar: { backgroundColor: '#81c784' },
  textoBotao: { color: '#fff', fontWeight: '600' },
});
