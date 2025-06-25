import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';

export default function TelaInicial({ navigation }) {
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
            <Text style={styles.title}>Bem-vindo!</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={styles.buttonText}>Criar Conta</Text>
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
    width: '80%',
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
    color: '#000',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});
