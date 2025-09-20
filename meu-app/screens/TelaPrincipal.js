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
  const [cultivos, setCultivos] = useState([]);

  const carregarCultivos = async () => {
    try {
      // pega usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) return;

      // busca produtor vinculado ao usuário
      const { data: produtor } = await supabase
        .from('productor')
        .select('uuid_id')
        .eq('user_id', user.id)
        .single();

      if (!produtor) return;

      // busca cultivos vinculados ao produtor
      const { data, error } = await supabase
        .from('cultivo')
        .select('*')
        .eq('produtor_id', produtor.uuid_id);

      if (error) {
        console.error(error);
        return;
      }

      setCultivos(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarCultivos(); // recarrega ao voltar para tela
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Conteúdo principal */}
      <View style={styles.content}>
        {user && (
          <Text style={styles.bemVindo}>
            Bem-vindo, {user.user_metadata?.nome || user.email}!
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
         <Text style={styles.cardText}>{cultivo.nome}</Text>
  </TouchableOpacity>
))

          )}
        </ScrollView>
      </View>

      {/* Fundo com imagem e botão */}
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
