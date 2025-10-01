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
  Modal,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // estados do modal de reset
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1); // 1 = pede email, 2 = pede código + senha
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
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

  // 🔹 etapa 1: enviar código pro email
  const handleEnviarCodigo = async () => {
    try {
      const res = await fetch(
        'https://sxwoiuqwiavwjnazxvag.supabase.co/functions/v1/enviarCodigo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Código enviado', 'Verifique seu e-mail.');
        setStep(2);
      } else {
        Alert.alert('Erro', data.error || 'Não foi possível enviar o código.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao conectar.');
    }
  };

  // 🔹 etapa 2: validar código e redefinir senha
  const handleValidarCodigo = async () => {
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const res = await fetch(
        'https://sxwoiuqwiavwjnazxvag.supabase.co/functions/v1/validarCodigo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, codigo, novaSenha }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Sucesso', 'Senha redefinida com sucesso.');
        setModalVisible(false);
        setStep(1);
        setCodigo('');
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        Alert.alert('Erro', data.error || 'Código inválido.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao conectar.');
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

            {/* Botão "Esqueceu a senha?" */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.link}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 🔹 Modal de Reset de Senha */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            {step === 1 ? (
              <>
                <Text style={styles.modalTitle}>Esqueceu a senha?</Text>
                <TextInput
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleEnviarCodigo}
                >
                  <Text style={styles.buttonText}>Enviar código</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Digite o código recebido</Text>
                <TextInput
                  placeholder="Código"
                  value={codigo}
                  onChangeText={setCodigo}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Nova senha"
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry
                  style={styles.input}
                />
                <TextInput
                  placeholder="Confirmar nova senha"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleValidarCodigo}
                >
                  <Text style={styles.buttonText}>Redefinir senha</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, { marginTop: 10, backgroundColor: '#ccc' }]}
              onPress={() => {
                setModalVisible(false);
                setStep(1);
              }}
            >
              <Text style={[styles.buttonText, { color: '#000' }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  link: {
    marginTop: 10,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#60b246',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
  },
});
