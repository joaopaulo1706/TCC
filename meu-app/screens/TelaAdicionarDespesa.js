import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaAdicionarDespesa({ route, navigation }) {
  const { cultivo } = route.params; // cultivo vem da tela anterior
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');

  // função para validar e converter datas tipo 29/06/2025 → 2025-06-29
  const formatarData = (dataDigitada) => {
    if (dataDigitada.includes('/')) {
      const [dia, mes, ano] = dataDigitada.split('/');
      return `${ano}-${mes}-${dia}`;
    }
    return dataDigitada; // se já vier no formato YYYY-MM-DD
  };

  const salvarDespesa = async () => {
    if (!tipo || !valor || !data) {
      alert('Preencha todos os campos!');
      return;
    }

    const dataFormatada = formatarData(data);

    const { error } = await supabase.from('despesas').insert([
      {
        tipo,
        valor: parseFloat(valor), // garante número
        data: dataFormatada,       // sempre no formato certo
        cultivo_id: cultivo.id,    // usa cultivo_id (uuid) em vez de productor_id
      },
    ]);

    if (error) {
      console.error(error);
      alert('Erro ao salvar despesa');
    } else {
      alert('Despesa cadastrada com sucesso!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Despesas</Text>
      <View style={styles.linha} />

      <Text style={styles.label}>Tipo de despesa:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Mão de obra"
        value={tipo}
        onChangeText={setTipo}
      />

      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        placeholder="R$"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.label}>Data:</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD ou DD/MM/AAAA"
        value={data}
        onChangeText={setData}
      />

      <View style={styles.botoes}>
        <TouchableOpacity
          style={[styles.botao, styles.cancelar]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, styles.salvar]}
          onPress={salvarDespesa}
        >
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3eedc',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  linha: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  botao: {
    flex: 1,
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelar: {
    backgroundColor: '#e57373',
  },
  salvar: {
    backgroundColor: '#81c784',
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
