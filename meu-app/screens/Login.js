import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      // Faz login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        Alert.alert('Erro no login', error.message);
        return;
      }

      if (data.user) {
        Alert.alert('Sucesso', `Bem-vindo, ${data.user.email}`);
        navigation.navigate('TelaPrincipal');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível realizar login.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fundo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.topCard}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bottomCard}>
            <Text style={styles.title}>Entrar:</Text>

            <TextInput
              placeholder="E-mail:"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Senha:"
              style={styles.input}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '85%',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
  },
  topCard: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: { width: 60, height: 60 },
  bottomCard: {
    backgroundColor: '#60b246',
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 22, marginBottom: 15, fontWeight: 'bold', color: '#fff' },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, color: '#000', fontWeight: 'bold' },
});
