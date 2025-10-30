import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <<<
import { supabase } from '../config/supabaseClient';

export default function TelaReceitas({ route, navigation }) {
  const { cultivo } = route.params;
  const insets = useSafeAreaInsets(); // <<<

  const [producao, setProducao] = useState('');
  const [valorSc, setValorSc] = useState('');
  const [totalVenda, setTotalVenda] = useState('');
  const [despesas, setDespesas] = useState(0);
  const [bruto, setBruto] = useState(0);
  const [liquido, setLiquido] = useState(0);
  const [eventos, setEventos] = useState([]);

  const carregarCustos = async () => {
    const { data: d } = await supabase.from('despesas').select('valor').eq('cultivo_id', cultivo.id);
    const { data: i } = await supabase.from('investimentos').select('valor').eq('cultivo_id', cultivo.id);
    const total = (d?.reduce((a, b) => a + Number(b.valor), 0) || 0) + (i?.reduce((a, b) => a + Number(b.valor), 0) || 0);
    setDespesas(total);
  };

  const carregarEventos = async () => {
    const { data } = await supabase
      .from('agenda')
      .select('*')
      .eq('cultivo_id', cultivo.id)
      .order('data', { ascending: true });
    setEventos(data || []);
  };

  const carregarVendas = async () => {
    const { data } = await supabase.from('vendas').select('quantidade, valor').eq('cultivo_id', cultivo.id);
    const totalProducao = (data || []).reduce((a, v) => a + Number(v.quantidade), 0);
    const totalValor = (data || []).reduce((a, v) => a + Number(v.valor), 0);
    const valorMedio = totalProducao > 0 ? (totalValor / totalProducao).toFixed(2) : 0;

    setProducao(String(totalProducao));
    setTotalVenda(totalValor);
    setValorSc(String(valorMedio));
    setBruto(totalValor);
    setLiquido(totalValor - despesas);
  };

  useEffect(() => {
    carregarCustos();
    carregarEventos();
    carregarVendas();
  }, []);

  const formatarData = (data) => {
    if (!data) return '';
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const concluirSafra = async () => {
    Alert.alert('Você tem certeza?', 'Ao concluir a safra, você ainda poderá editar os cultivos.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Concluir',
        onPress: async () => {
          const hoje = new Date().toISOString().split('T')[0];
          const { error } = await supabase
            .from('cultivo')
            .update({ finalizado: true, finalizado_em: hoje })
            .eq('id', cultivo.id);
          if (error) alert('Erro ao concluir safra!');
          else {
            alert('Safra concluída com sucesso!');
            navigation.navigate('TelaPrincipal');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 }, // <<< espaço extra no final
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
    >
      <Text style={styles.titulo}>Receitas</Text>
      <View style={styles.linha} />

      <Text>Produção total (sacas/caixas):</Text>
      <TextInput style={styles.input} value={producao} editable={false} />

      <Text>Valor comercializado (R$ por saca/caixa):</Text>
      <TextInput style={styles.input} value={valorSc} editable={false} />

      <Text>Valor total da venda:</Text>
      <TextInput style={styles.input} value={String(totalVenda)} editable={false} />

      <Text>Valor total das despesas:</Text>
      <TextInput style={styles.input} value={String(despesas)} editable={false} />

      <Text>Valor bruto:</Text>
      <TextInput style={styles.input} value={String(bruto)} editable={false} />

      <Text>Valor líquido:</Text>
      <TextInput style={styles.input} value={String(liquido)} editable={false} />

      <Text style={[styles.titulo, { marginTop: 20 }]}>
        Eventos realizados durante esta safra:
      </Text>

      {/* Caixa com rolagem independente */}
      <View style={styles.caixaEventos}>
        <ScrollView
          style={styles.scrollEventos}
          nestedScrollEnabled
          showsVerticalScrollIndicator
        >
          {eventos.length === 0 ? (
            <Text style={styles.aviso}>Nenhum evento cadastrado</Text>
          ) : (
            eventos.map((ev) => (
              <View key={ev.id} style={styles.itemEvento}>
                <Text style={styles.data}>{formatarData(ev.data)}</Text>
                <Text style={styles.texto}>{ev.evento}</Text>
                {ev.observacao ? <Text style={styles.obs}>Obs: {ev.observacao}</Text> : null}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.botao} onPress={concluirSafra}>
        <Text style={styles.textoBotao}>Concluir safra</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3eedc' },
  content: { padding: 20 }, // <<< movei o padding para o contentContainer
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
  caixaEventos: {
    height: 260,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 10,
    overflow: 'hidden',
  },
  scrollEventos: {
    paddingHorizontal: 8,
    paddingVertical: 6,
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
