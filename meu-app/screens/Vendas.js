import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaVendas({ route, navigation }) {
  const { cultivo } = route.params;
  const [vendas, setVendas] = useState([]);
  const [expandida, setExpandida] = useState(null); // id da venda aberta

  // converte YYYY-MM-DD -> DD/MM/AAAA
  const formatarDataParaTela = (dataBanco) => {
    if (!dataBanco) return '';
    const somenteData = dataBanco.split('T')[0]; // remove hora caso venha
    const partes = somenteData.split('-'); // [YYYY, MM, DD]
    if (partes.length !== 3) return dataBanco;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // DD/MM/AAAA -> YYYY-MM-DD
  const formatarDataParaBanco = (dataTela) => {
    if (!dataTela) return null;
    const partes = dataTela.split('/');
    if (partes.length !== 3) return dataTela;
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

  const carregarVendas = async () => {
    const { data, error } = await supabase
      .from('vendas')
      .select('*')
      .eq('cultivo_id', cultivo.id)
      .order('data', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      const formatadas = data.map((v) => ({
        ...v,
        data: v.data ? formatarDataParaTela(v.data) : '',
      }));
      setVendas(formatadas);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarVendas();
    });
    return unsubscribe;
  }, [navigation]);

  // excluir venda
  const excluirVenda = async (id) => {
    const { error } = await supabase.from('vendas').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('Erro ao excluir venda');
    } else {
      setExpandida(null);
      carregarVendas();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vendas</Text>
      <View style={styles.linha} />

      <ScrollView contentContainerStyle={styles.lista}>
        {vendas.length === 0 ? (
          <Text style={styles.aviso}>Nenhuma venda registrada</Text>
        ) : (
          vendas.map((v) => (
            <View key={v.id} style={styles.item}>
              {/* Cabeçalho com dropdown */}
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setExpandida(expandida === v.id ? null : v.id)}
              >
                {/* Exibe quantidade + tipo */}
                <Text style={styles.dropdownTexto}>
                  {v.quantidade} - {v.tipo}
                </Text>
                <Text style={styles.seta}>
                  {expandida === v.id ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {/* Detalhes */}
              {expandida === v.id && (
                <View style={styles.detalhes}>
                  <Text style={styles.itemTexto}>Quantidade: {v.quantidade}</Text>
                  <Text style={styles.itemTexto}>Produto: {v.tipo}</Text>
                  <Text style={styles.itemTexto}>Valor: R$ {v.valor}</Text>
                  <Text style={styles.itemTexto}>
                    Data: {v.data ? v.data : 'Sem data'}
                  </Text>

                  <View style={styles.acoes}>
                    <TouchableOpacity
                      style={[styles.botaoAcao, styles.alterar]}
                      onPress={() =>
                        navigation.navigate('AdicionarVenda', {
                          cultivo,
                          venda: {
                            ...v,
                            data: formatarDataParaBanco(v.data),
                          },
                        })
                      }
                    >
                      <Text style={styles.textoBotao}>Alterar dados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.botaoAcao, styles.excluir]}
                      onPress={() => excluirVenda(v.id)}
                    >
                      <Text style={styles.textoBotao}>Excluir venda</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('AdicionarVenda', { cultivo })}
      >
        <Text style={styles.textoBotao}>Adicionar venda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3eedc', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  linha: { height: 1, backgroundColor: '#000', marginVertical: 10 },
  lista: { paddingBottom: 20 },
  aviso: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
  item: {
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#e6ddc4',
  },
  dropdownTexto: { fontSize: 16, fontWeight: '600' },
  seta: { fontSize: 16 },
  detalhes: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  itemTexto: { fontSize: 14, marginBottom: 4 },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoAcao: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  alterar: { backgroundColor: '#ffd54f' },
  excluir: { backgroundColor: '#e57373' },
  botao: {
    backgroundColor: '#a5d6a7',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotao: { fontSize: 14, fontWeight: '600', color: '#000' },
});
