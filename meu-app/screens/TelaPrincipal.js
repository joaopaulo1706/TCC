import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function TelaPrincipal({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

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
        <Text style={styles.aviso}>Nenhum cultivo cadastrado</Text>
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
