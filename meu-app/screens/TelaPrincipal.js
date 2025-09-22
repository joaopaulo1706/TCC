import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaPrincipal({ navigation }) {
  const [user, setUser] = useState(null);
  const [nomeProdutor, setNomeProdutor] = useState('');
  const [cultivos, setCultivos] = useState([]);

  const carregarDados = async () => {
    try {
      // pega usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) return;

      // busca produtor vinculado ao usuário
      const { data: produtor, error: err1 } = await supabase
        .from('productor')
        .select('uuid_id, nome')
        .eq('user_id', user.id)
        .single();

      if (err1 || !produtor) return;

      setNomeProdutor(produtor.nome);

      // busca cultivos vinculados ao produtor (ordenando pelo mais novo)
      const { data, error: err2 } = await supabase
        .from('cultivo')
        .select('*')
        .eq('produtor_id', produtor.uuid_id)
        .order('created_at', { ascending: false });

      if (err2) {
        console.error(err2);
        return;
      }

      setCultivos(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });
    carregarDados();
    return unsubscribe;
  }, [navigation]);

  // formatar data YYYY-MM-DD -> DD/MM/AAAA
  const formatarData = (data) => {
    if (!data) return '';
    const partes = data.split('-');
    if (partes.length !== 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {user && (
          <Text style={styles.bemVindo}>
            Bem-vindo, {nomeProdutor || user.email}!
          </Text>
        )}
        <Text style={styles.title}>Meus Cultivos</Text>
        <View style={styles.linha} />

        <ScrollView>
          {cultivos.length === 0 ? (
            <Text style={styles.aviso}>Nenhum cultivo cadastrado</Text>
          ) : (
            cultivos.map((cultivo) => (
              <TouchableOpacity
                key={cultivo.id}
                style={styles.card}
                onPress={() => navigation.navigate('TelaSelecao', { cultivo })}
              >
                <Text style={styles.cardText}>
                  {cultivo.nome} - Safra {cultivo.safra}
                  {cultivo.tipo ? ` (${cultivo.tipo})` : ''}
                </Text>

                {/* 🔴 Exibe aviso de safra concluída */}
                {cultivo.finalizado && (
                  <Text style={styles.safraConcluida}>
                    Safra concluída em{' '}
                    {cultivo.finalizado_em
                      ? formatarData(cultivo.finalizado_em)
                      : ''}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <ImageBackground
        source={require('../assets/fundo.jpg')}
        style={styles.footer}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('CadastroCultivo')}
        >
          <Text style={styles.botaoTexto}>+Cadastrar Cultivo</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6ddc4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bemVindo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  linha: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 5,
    width: '60%',
  },
  aviso: {
    color: 'brown',
    marginTop: 15,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f5e9c9',
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  safraConcluida: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botao: {
    backgroundColor: '#60b246',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  botaoTexto: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
