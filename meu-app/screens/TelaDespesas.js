import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaDespesas({ route, navigation }) {
  const { cultivo } = route.params;
  const [despesas, setDespesas] = useState([]);
  const [expandida, setExpandida] = useState(null); // id da despesa aberta

  const carregarDespesas = async () => {
    const { data, error } = await supabase
      .from('despesas')
      .select('*')
      .eq('cultivo_id', cultivo.id)
      .order('data', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setDespesas(data);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDespesas();
    });
    return unsubscribe;
  }, [navigation]);

  // excluir despesa
  const excluirDespesa = async (id) => {
    const { error } = await supabase.from('despesas').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('Erro ao excluir despesa');
    } else {
      setExpandida(null);
      carregarDespesas();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Despesas</Text>
      <View style={styles.linha} />

      <ScrollView contentContainerStyle={styles.lista}>
        {despesas.length === 0 ? (
          <Text style={styles.aviso}>Nenhuma despesa</Text>
        ) : (
          despesas.map((d) => (
            <View key={d.id} style={styles.item}>
              {/* cabeçalho com dropdown */}
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setExpandida(expandida === d.id ? null : d.id)}
              >
                <Text style={styles.dropdownTexto}>{d.tipo}</Text>
                <Text style={styles.seta}>
                  {expandida === d.id ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {/* detalhes se expandido */}
              {expandida === d.id && (
                <View style={styles.detalhes}>
                  <Text style={styles.itemTexto}>R$ {d.valor}</Text>
                  <Text style={styles.itemTexto}>{d.data}</Text>

                  <View style={styles.acoes}>
                    <TouchableOpacity
                      style={[styles.botaoAcao, styles.alterar]}
                      onPress={() =>
                        navigation.navigate('TelaAdicionarDespesa', {
                          cultivo,
                          despesa: d,
                        })
                      }
                    >
                      <Text style={styles.textoBotao}>Alterar dados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.botaoAcao, styles.excluir]}
                      onPress={() => excluirDespesa(d.id)}
                    >
                      <Text style={styles.textoBotao}>Excluir despesa</Text>
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
        onPress={() => navigation.navigate('TelaAdicionarDespesa', { cultivo })}
      >
        <Text style={styles.textoBotao}>Adicionar despesa</Text>
      </TouchableOpacity>
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
  lista: {
    paddingBottom: 20,
  },
  aviso: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
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
  dropdownTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
  seta: {
    fontSize: 16,
  },
  detalhes: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  itemTexto: {
    fontSize: 14,
    marginBottom: 4,
  },
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
  alterar: {
    backgroundColor: '#ffd54f',
  },
  excluir: {
    backgroundColor: '#e57373',
  },
  botao: {
    backgroundColor: '#a5d6a7',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});
