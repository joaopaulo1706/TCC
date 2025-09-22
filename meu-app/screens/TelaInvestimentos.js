import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaInvestimentos({ route, navigation }) {
  const { cultivo } = route.params;
  const [investimentos, setInvestimentos] = useState([]);
  const [expandida, setExpandida] = useState(null); // id do investimento aberto

  // converte YYYY-MM-DD ou objeto Date -> DD/MM/AAAA
const formatarDataParaTela = (dataBanco) => {
  if (!dataBanco) return '';

  try {
    // Se for objeto Date
    if (dataBanco instanceof Date) {
      const dia = String(dataBanco.getDate()).padStart(2, '0');
      const mes = String(dataBanco.getMonth() + 1).padStart(2, '0');
      const ano = dataBanco.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    // Se vier como string "2025-10-20"
    if (typeof dataBanco === 'string' && dataBanco.includes('-')) {
      const partes = dataBanco.split('-'); // [YYYY, MM, DD]
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return dataBanco; // fallback
  } catch (e) {
    console.error('Erro ao formatar data:', e);
    return '';
  }
};


  // converte DD/MM/AAAA -> YYYY-MM-DD
  const formatarDataParaBanco = (dataTela) => {
    if (!dataTela) return null;
    const partes = dataTela.split('/');
    if (partes.length !== 3) return dataTela;
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

 const carregarInvestimentos = async () => {
  const { data, error } = await supabase
    .from('investimentos')
    .select('*')
    .eq('cultivo_id', cultivo.id)
    .order('data', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
  } else {
    const formatadas = data.map((i) => ({
      ...i,
      data: i.data ? formatarDataParaTela(i.data) : '',
    }));
    setInvestimentos(formatadas);
  }
};


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarInvestimentos();
    });
    return unsubscribe;
  }, [navigation]);

  // excluir investimento
  const excluirInvestimento = async (id) => {
    const { error } = await supabase.from('investimentos').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('Erro ao excluir investimento');
    } else {
      setExpandida(null);
      carregarInvestimentos();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Investimentos</Text>
      <View style={styles.linha} />

      <ScrollView contentContainerStyle={styles.lista}>
        {investimentos.length === 0 ? (
          <Text style={styles.aviso}>Nenhum investimento</Text>
        ) : (
          investimentos.map((i) => (
            <View key={i.id} style={styles.item}>
              {/* cabeçalho com dropdown */}
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setExpandida(expandida === i.id ? null : i.id)}
              >
                <Text style={styles.dropdownTexto}>{i.tipo}</Text>
                <Text style={styles.seta}>
                  {expandida === i.id ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {/* detalhes se expandido */}
              {expandida === i.id && (
                <View style={styles.detalhes}>
                  <Text style={styles.itemTexto}>R$ {i.valor}</Text>
                  <Text style={styles.itemTexto}>
                    {i.data ? i.data : 'Sem data'}
                  </Text>

                  <View style={styles.acoes}>
                    <TouchableOpacity
                      style={[styles.botaoAcao, styles.alterar]}
                      onPress={() =>
                        navigation.navigate('TelaAdicionarInvestimento', {
                          cultivo,
                          investimento: {
                            ...i,
                            data: formatarDataParaBanco(i.data), // manda pro input no formato aceito
                          },
                        })
                      }
                    >
                      <Text style={styles.textoBotao}>Alterar dados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.botaoAcao, styles.excluir]}
                      onPress={() => excluirInvestimento(i.id)}
                    >
                      <Text style={styles.textoBotao}>Excluir investimento</Text>
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
        onPress={() => navigation.navigate('TelaAdicionarInvestimento', { cultivo })}
      >
        <Text style={styles.textoBotao}>Adicionar investimento</Text>
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
