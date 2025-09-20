import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';

export default function TelaSelecao({ route, navigation }) {
  const { cultivo } = route.params; // recebe o cultivo passado da tela anterior

  return (
    <ImageBackground
      source={require('../assets/fundo.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>{cultivo.nome}</Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('TelaDespesas', { cultivo })}
        >
          <Text style={styles.textoBotao}>Despesas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('TelaInvestimentos', { cultivo })}
        >
          <Text style={styles.textoBotao}>Investimentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('TelaReceitas', { cultivo })}
        >
          <Text style={styles.textoBotao}>Receitas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('TelaAgenda', { cultivo })}
        >
          <Text style={styles.textoBotao}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('TelaConfiguracoes', { cultivo })}
        >
          <Text style={styles.textoBotao}>Configurações</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6ddc4',
  },
  scroll: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  botao: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    elevation: 5,
  },
  textoBotao: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
