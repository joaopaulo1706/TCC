import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from "react-native";

export default function TelaSuporte({ navigation }) {
  const [mensagem, setMensagem] = useState("");

  const enviarEmail = () => {
    if (!mensagem.trim()) {
      Alert.alert("Aviso", "Digite sua dúvida ou reclamação antes de enviar.");
      return;
    }

    const email = "agc170608@gmail.com";
    const subject = "Suporte - App Cultivo";
    const body = encodeURIComponent(mensagem);

    const mailUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(mailUrl)
      .then(() => {
        setMensagem(""); // limpa campo
      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o aplicativo de email.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Suporte</Text>
      <View style={styles.linha} />

      <Text style={styles.label}>Digite aqui sua dúvida ou reclamação</Text>

      <TextInput
        style={styles.input}
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Digite aqui..."
        placeholderTextColor="#555"
        multiline
      />

      <TouchableOpacity
        style={[styles.botao, styles.botaoConcluir]}
        onPress={enviarEmail}
      >
        <Text style={styles.textoBotao}>Enviar</Text>
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
  label: { fontSize: 16, marginBottom: 10, color: "#333" },
  input: {
    backgroundColor: "#f5e9c9",
    borderRadius: 8,
    padding: 15,
    minHeight: 150,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  botao: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoConcluir: {
    backgroundColor: "#60b246",
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
