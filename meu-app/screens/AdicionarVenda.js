import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function AdicionarVenda({ route, navigation }) {
  const { cultivo, venda } = route.params || {};

  // Estados
  const [quantidade, setQuantidade] = useState(venda ? venda.quantidade : '');
  const [tipo, setTipo] = useState(venda ? venda.tipo : '');
  const [valor, setValor] = useState(venda ? String(venda.valor) : '');
  const [data, setData] = useState(
    venda ? formatarDataParaTela(venda.data) : ''
  );

  // Função para exibir a data no formato DD/MM/AAAA
  function formatarDataParaTela(dataBanco) {
    if (!dataBanco) return '';
    const partes = dataBanco.split('-'); // [YYYY, MM, DD]
    if (partes.length !== 3) return dataBanco;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Função para inserir barras automaticamente
  const handleDataChange = (texto) => {
    let digits = texto.replace(/\D/g, ''); // só números
    if (digits.length > 8) digits = digits.slice(0, 8);

    let formatada = digits;
    if (digits.length > 4) {
      formatada = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(
        4
      )}`;
    } else if (digits.length > 2) {
      formatada = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    setData(formatada);
  };

  // Converter para YYYY-MM-DD antes de salvar no banco
  const formatarDataParaBanco = (dataDigitada) => {
    if (!dataDigitada) return null;
    const limpa = dataDigitada.replace(/\D/g, '');
    if (limpa.length !== 8) return null;

    const dia = limpa.slice(0, 2);
    const mes = limpa.slice(2, 4);
    const ano = limpa.slice(4, 8);

    return `${ano}-${mes}-${dia}`;
  };

  const salvarVenda = async () => {
    if (!quantidade || !tipo || !valor || !data) {
      alert('Preencha todos os campos!');
      return;
    }

    const dataFormatada = formatarDataParaBanco(data);
    if (!dataFormatada) {
      alert('Data inválida! Use o formato DD/MM/AAAA.');
      return;
    }

    let error;
    if (venda && venda.id) {
      // Atualizar venda existente
      ({ error } = await supabase
        .from('vendas')
        .update({
          quantidade,
          tipo,
          valor: parseFloat(valor),
          data: dataFormatada,
        })
        .eq('id', venda.id)
        .select());
    } else {
      // Inserir nova venda
      ({ error } = await supabase.from('vendas').insert([
        {
          quantidade,
          tipo,
          valor: parseFloat(valor),
          data: dataFormatada,
          cultivo_id: cultivo.id,
        },
      ]));
    }

    if (error) {
      console.error(error);
      alert('Erro ao salvar venda');
    } else {
      alert('Venda salva com sucesso!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {venda ? 'Editar Venda' : 'Nova Venda'}
      </Text>
      <View style={styles.linha} />

      <Text style={styles.label}>Quantidade vendida: (sacas/caixas)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 20, 200..."
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <Text style={styles.label}>Tipo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Banana prata, arroz irrigado..."
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
          onPress={salvarVenda}
        >
          <Text style={styles.textoBotao}>
            {venda ? 'Salvar Alterações' : 'Salvar'}
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
