import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

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
            <Text style={styles.title}>Criar conta:</Text>

            <TextInput
              placeholder="Nome:"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              placeholder="E-mail:"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Senha:"
              style={styles.input}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

           <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('TelaPrincipal')}
>
  <Text style={styles.buttonText}>Cadastrar</Text>
</TouchableOpacity>

          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  topCard: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  bottomCard: {
    backgroundColor: '#60b246',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
  },
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
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});
