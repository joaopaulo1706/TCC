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

export default function Login({ navigation }) {
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
            <Text style={styles.title}>Entrar:</Text>

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

            <TouchableOpacity onPress={() => {/* lógica para recuperar senha */}}>
              <Text style={styles.link}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('TelaPrincipal')}
>
  <Text style={styles.buttonText}>Confirmar</Text>
</TouchableOpacity>


            <Text style={styles.ou}>Ou</Text>

            <TouchableOpacity style={styles.googleButton}>
              <Text style={styles.googleText}>Entrar com google</Text>
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
  link: {
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 10,
    fontSize: 13,
    color: '#000',
  },
  button: {
    backgroundColor: '#fff',
    marginTop: 5,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  ou: {
    marginVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleText: {
    fontSize: 16,
    marginLeft: 5,
  },
});
