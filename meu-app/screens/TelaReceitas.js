import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaReceitas({ route, navigation }) {
  const { cultivo } = route.params;
  const [producao, setProducao] = useState(0);     // produção total
  const [valorSc, setValorSc] = useState(0);       // valor comercializado médio
  const [totalVenda, setTotalVenda] = useState(0); // soma total das vendas
  const [despesas, setDespesas] = useState(0);
  const [bruto, setBruto] = useState(0);
  const [liquido, setLiquido] = useState(0);

  // Carregar despesas e investimentos
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

  // Carregar vendas
  const carregarVendas = async () => {
    const { data, error } = await supabase
      .from('vendas')
      .select('quantidade, valor')
      .eq('cultivo_id', cultivo.id);

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      const totalQtd = data.reduce((acc, v) => acc + (Number(v.quantidade) || 0), 0);
      const totalVal = data.reduce((acc, v) => acc + (Number(v.valor) || 0), 0);

      setProducao(totalQtd);
      setTotalVenda(totalVal);

      // valor médio por unidade (se quantidade > 0)
      setValorSc(totalQtd > 0 ? totalVal / totalQtd : 0);
    } else {
      setProducao(0);
      setTotalVenda(0);
      setValorSc(0);
    }
  };

  // Atualizar bruto e líquido sempre que mudar vendas ou despesas
  useEffect(() => {
    setBruto(totalVenda);
    setLiquido(totalVenda - despesas);
  }, [totalVenda, despesas]);

  useEffect(() => {
    carregarCustos();
    carregarVendas();
  }, []);

  const concluirSafra = async () => {
    Alert.alert(
      "Você tem certeza?",
      "Ao concluir a safra, você não poderá mais realizar alterações, apenas visualizar.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Concluir",
          onPress: async () => {
            const { error } = await supabase
              .from('cultivo')
              .update({ finalizado: true })
              .eq('id', cultivo.id);

            if (error) {
              console.error(error);
              alert("Erro ao concluir safra!");
            } else {
              alert("Safra concluída com sucesso!");
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Receitas</Text>
      <View style={styles.linha} />

      <Text>Produção total (sacas/caixas):</Text>
      <TextInput style={styles.input} value={String(producao)} editable={false} />

      <Text>Valor comercializado (R$ por saca/caixa):</Text>
      <TextInput style={styles.input} value={String(valorSc.toFixed(2))} editable={false} />

      <Text>Valor total da venda:</Text>
      <TextInput style={styles.input} value={String(totalVenda)} editable={false} />

      <Text>Valor total das despesas:</Text>
      <TextInput style={styles.input} value={String(despesas)} editable={false} />

      <Text>Valor bruto:</Text>
      <TextInput style={styles.input} value={String(bruto)} editable={false} />

      <Text>Valor líquido:</Text>
      <TextInput style={styles.input} value={String(liquido)} editable={false} />

      <TouchableOpacity style={styles.botao} onPress={concluirSafra}>
        <Text style={styles.textoBotao}>Concluir safra</Text>
      </TouchableOpacity>
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
});
