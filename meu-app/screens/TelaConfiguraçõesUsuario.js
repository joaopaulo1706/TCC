import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function TelaConfiguracoes({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurações</Text>
      <View style={styles.linha} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("Tutorial")}
        >
          <Text style={styles.textoBotao}>Tutorial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("TelaConta")}
        >
          <Text style={styles.textoBotao}>Sua conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("TelaSuporte")} // ✅ agora abre a tela de suporte
        >
          <Text style={styles.textoBotao}>Suporte</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[styles.botao, styles.botaoConcluir]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoBotao}>Concluído</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e6ddc4", padding: 20 },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
  },
  linha: { height: 1, backgroundColor: "#000", marginBottom: 15 },
  scroll: { flexGrow: 1 },
  botao: {
    backgroundColor: "#f5e9c9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  botaoConcluir: {
    backgroundColor: "#60b246",
    marginTop: 20,
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },
});
