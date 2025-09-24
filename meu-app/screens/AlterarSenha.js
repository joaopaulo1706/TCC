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

export default function AlterarSenha({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const salvarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // ⚠️ O Supabase não exige a senha atual para trocar (só o token do usuário logado)
    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível alterar a senha.");
    } else {
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alterar Senha</Text>
      <View style={styles.linha} />

      <Text>Senha Atual:</Text>
      <TextInput
        style={styles.input}
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
      />

      <Text>Nova Senha:</Text>
      <TextInput
        style={styles.input}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <Text>Confirmar Nova Senha:</Text>
      <TextInput
        style={styles.input}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
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
          onPress={salvarSenha}
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
