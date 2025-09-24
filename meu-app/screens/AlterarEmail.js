import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../config/supabaseClient";

export default function AlterarEmail({ navigation }) {
  const [novoEmail, setNovoEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");

  const salvarEmail = async () => {
    if (novoEmail.trim() === "" || confirmarEmail.trim() === "") {
      Alert.alert("Erro", "Preencha os dois campos!");
      return;
    }

    if (novoEmail !== confirmarEmail) {
      Alert.alert("Erro", "Os emails não coincidem!");
      return;
    }

    // atualizar email no Supabase
    const { error } = await supabase.auth.updateUser({
      email: novoEmail,
    });

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o email.");
    } else {
      Alert.alert(
        "Sucesso",
        "Email alterado! Confirme pelo link enviado ao novo endereço."
      );
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alterar Email</Text>
      <View style={styles.linha} />

      <Text>Novo Email:</Text>
      <TextInput
        style={styles.input}
        value={novoEmail}
        onChangeText={setNovoEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text>Confirmar Novo Email:</Text>
      <TextInput
        style={styles.input}
        value={confirmarEmail}
        onChangeText={setConfirmarEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.botoes}>
        <TouchableOpacity
          style={[styles.botao, styles.cancelar]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botao, styles.salvar]}
          onPress={salvarEmail}
        >
          <Text style={styles.textoBotao}>Concluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3eedc", padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  linha: { height: 1, backgroundColor: "#000", marginVertical: 10 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  botao: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelar: { backgroundColor: "#e57373" },
  salvar: { backgroundColor: "#81c784" },
  textoBotao: { color: "#fff", fontWeight: "600" },
});
