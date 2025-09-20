import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaAdicionarInvestimento({ route, navigation }) {
  const { cultivo, investimento } = route.params || {};

  // Função para exibir a data no formato DD/MM/AAAA
  function formatarDataParaTela(dataBanco) {
    if (!dataBanco) return '';

    // Se vier com hora (ex: 2025-10-20T00:00:00.000Z)
    const somenteData = dataBanco.split('T')[0]; // pega só a parte da data

    const partes = somenteData.split('-'); // [YYYY, MM, DD]
    if (partes.length !== 3) return dataBanco;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Converter para YYYY-MM-DD antes de salvar no banco
  const formatarDataParaBanco = (dataDigitada) => {
    if (!dataDigitada) return '';
    const limpa = dataDigitada.replace(/\D/g, '');
    if (limpa.length !== 8) return '';

    const dia = limpa.slice(0, 2);
    const mes = limpa.slice(2, 4);
    const ano = limpa.slice(4, 8);

    return `${ano}-${mes}-${dia}`;
  };

  // Estados
  const [tipo, setTipo] = useState(investimento ? investimento.tipo : '');
  const [valor, setValor] = useState(investimento ? String(investimento.valor) : '');
  const [data, setData] = useState(
    investimento ? formatarDataParaTela(investimento.data) : ''
  );

  // Função para inserir barras automaticamente enquanto digita
  const handleDataChange = (texto) => {
    let digits = texto.replace(/\D/g, ''); // só números

    if (digits.length > 8) digits = digits.slice(0, 8);

    let formatada = digits;
    if (digits.length > 4) {
      formatada = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatada = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    setData(formatada);
  };

  // Salvar ou atualizar investimento
  const salvarInvestimento = async () => {
    if (!tipo || !valor || !data) {
      alert('Preencha todos os campos!');
      return;
    }

    const dataFormatada = formatarDataParaBanco(data);

    let error;
    if (investimento && investimento.id) {
      // Atualizar investimento existente
      ({ error } = await supabase
        .from('investimentos')
        .update({
          tipo,
          valor: parseFloat(valor),
          data: dataFormatada,
        })
        .eq('id', investimento.id)
        .select());
    } else {
      // Inserir novo investimento
      ({ error } = await supabase.from('investimentos').insert([
        {
          tipo,
          valor: parseFloat(valor),
          data: dataFormatada,
          cultivo_id: cultivo.id,
        },
      ]));
    }

    if (error) {
      console.error(error);
      alert('Erro ao salvar investimento');
    } else {
      alert('Investimento salvo com sucesso!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {investimento ? 'Editar Investimento' : 'Novo Investimento'}
      </Text>
      <View style={styles.linha} />

      <Text style={styles.label}>Tipo de investimento:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Trator"
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
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        value={data}
        onChangeText={handleDataChange}
        maxLength={10}
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
          onPress={salvarInvestimento}
        >
          <Text style={styles.textoBotao}>
            {investimento ? 'Salvar Alterações' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3eedc', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  linha: { height: 1, backgroundColor: '#000', marginVertical: 10 },
  label: { fontSize: 16, marginTop: 15, marginBottom: 5 },
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
  cancelar: { backgroundColor: '#e57373' },
  salvar: { backgroundColor: '#81c784' },
  textoBotao: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
