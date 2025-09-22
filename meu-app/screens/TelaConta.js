import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { supabase } from "../config/supabaseClient";

export default function TelaConta({ navigation }) {
  const [user, setUser] = useState(null);

  const carregarUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(error);
    } else {
      setUser(user);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarUser();
    });
    return unsubscribe;
  }, [navigation]);

  // Função de logout
  const sairConta = async () => {
    try {
      await supabase.auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Redireciona para tela de login
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sua Conta</Text>
      <View style={styles.linha} />

      {/* Foto, Nome e Email */}
      <View style={styles.perfil}>
        {user?.user_metadata?.foto_url ? (
          <Image
            source={{ uri: user.user_metadata.foto_url }}
            style={styles.foto}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#555" }}>Sem foto</Text>
          </View>
        )}
        <Text style={styles.nome}>{user?.user_metadata?.nome || "Usuário"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Botões */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("AlterarNome")}
      >
        <Text style={styles.textoBotao}>Alterar nome</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("AlterarSenha")}
      >
        <Text style={styles.textoBotao}>Alterar senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("AlterarEmail")}
      >
        <Text style={styles.textoBotao}>Alterar email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("AlterarFoto")}
      >
        <Text style={styles.textoBotao}>Alterar foto de perfil</Text>
      </TouchableOpacity>

      {/* Botão Sair */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#e57373" }]}
        onPress={sairConta}
      >
        <Text style={styles.textoBotao}>Sair da conta</Text>
      </TouchableOpacity>

      {/* Botão Concluir */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#81c784", marginTop: 20 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoBotao}>Concluir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3eedc", padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  linha: { height: 1, backgroundColor: "#000", marginVertical: 10 },
  perfil: { alignItems: "center", marginBottom: 20 },
  foto: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  nome: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  email: { fontSize: 16, color: "#555", marginBottom: 15 },
  botao: {
    backgroundColor: "#E6DBB9",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  textoBotao: { fontWeight: "600", color: "#000" },
});
