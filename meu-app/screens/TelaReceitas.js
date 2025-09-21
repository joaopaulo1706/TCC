import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaReceitas({ route, navigation }) {
  const { cultivo } = route.params;
  const [producao, setProducao] = useState('');
  const [valorSc, setValorSc] = useState('');
  const [totalVenda, setTotalVenda] = useState('');
  const [despesas, setDespesas] = useState(0);
  const [bruto, setBruto] = useState(0);
  const [liquido, setLiquido] = useState(0);
  const [eventos, setEventos] = useState([]);

  // Função para carregar despesas + investimentos
  const carregarCustos = async () => {
    const { data: d, error: err1 } = await supabase
      .from('despesas')
      .select('valor')
      .eq('cultivo_id', cultivo.id);

    const { data: i, error: err2 } = await supabase
      .from('investimentos')
      .select('valor')
      .eq('cultivo_id', cultivo.id);

    if (err1 || err2) {
      console.error(err1 || err2);
      return;
    }

    const totalDespesas =
      (d?.reduce((acc, item) => acc + Number(item.valor), 0) || 0) +
      (i?.reduce((acc, item) => acc + Number(item.valor), 0) || 0);

    setDespesas(totalDespesas);
  };

  // Função para carregar eventos do cultivo
  const carregarEventos = async () => {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('cultivo_id', cultivo.id)
      .order('data', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }
    setEventos(data);
  };

  // Atualiza cálculos
  useEffect(() => {
    const venda = (Number(producao) || 0) * (Number(valorSc) || 0);
    setTotalVenda(venda);
    setBruto(venda);
    setLiquido(venda - despesas);
  }, [producao, valorSc, despesas]);

  useEffect(() => {
    carregarCustos();
    carregarEventos();
  }, []);

  const concluirSafra = async () => {
    Alert.alert(
      'Você tem certeza?',
      'Ao concluir a safra, você não poderá mais realizar alterações, apenas visualizar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: async () => {
            const { error } = await supabase
              .from('cultivo')
              .update({ finalizado: true })
              .eq('id', cultivo.id);

            if (error) {
              console.error(error);
              alert('Erro ao concluir safra!');
            } else {
              alert('Safra concluída com sucesso!');
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  // Função para formatar data
  const formatarData = (data) => {
    if (!data) return '';
    const partes = data.split('-'); // YYYY-MM-DD
    if (partes.length !== 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Receitas</Text>
      <View style={styles.linha} />

      <Text>Produção total (sacas/caixas):</Text>
      <TextInput
        style={styles.input}
        value={producao}
        onChangeText={setProducao}
        keyboardType="numeric"
        placeholder="Ex: 150"
      />

      <Text>Valor comercializado (R$ por saca/caixa):</Text>
      <TextInput
        style={styles.input}
        value={valorSc}
        onChangeText={setValorSc}
        keyboardType="numeric"
        placeholder="R$"
      />

      <Text>Valor total da venda:</Text>
      <TextInput style={styles.input} value={String(totalVenda)} editable={false} />

      <Text>Valor total das despesas:</Text>
      <TextInput style={styles.input} value={String(despesas)} editable={false} />

      <Text>Valor bruto:</Text>
      <TextInput style={styles.input} value={String(bruto)} editable={false} />

      <Text>Valor líquido:</Text>
      <TextInput style={styles.input} value={String(liquido)} editable={false} />

      {/* Eventos realizados */}
      <Text style={[styles.titulo, { marginTop: 20 }]}>
        Eventos realizados durante esta safra:
      </Text>
      {eventos.length === 0 ? (
        <Text style={styles.aviso}>Nenhum evento cadastrado</Text>
      ) : (
        eventos.map((ev) => (
          <View key={ev.id} style={styles.itemEvento}>
            <Text style={styles.data}>{formatarData(ev.data)}</Text>
            <Text style={styles.texto}>{ev.evento}</Text>
            {ev.observacao ? (
              <Text style={styles.obs}>Obs: {ev.observacao}</Text>
            ) : null}
          </View>
        ))
      )}

      <TouchableOpacity style={styles.botao} onPress={concluirSafra}>
        <Text style={styles.textoBotao}>Concluir safra</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3eedc', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  linha: { height: 1, backgroundColor: '#000', marginVertical: 10 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#81c784',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: { fontSize: 16, fontWeight: '600', color: '#fff' },
  aviso: { fontSize: 16, color: 'red', marginTop: 10 },
  itemEvento: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  data: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  texto: { fontSize: 14, marginTop: 2 },
  obs: { fontSize: 13, fontStyle: 'italic', color: '#555', marginTop: 2 },
});
