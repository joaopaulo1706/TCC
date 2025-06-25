// CadastroCultivo.js
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function CadastroCultivo({ navigation }) {
  const [identificacao, setIdentificacao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [area, setArea] = useState('');
  const [produtividade, setProdutividade] = useState('');
  const [ciclo, setCiclo] = useState('');
  const [nomeCultivo, setNomeCultivo] = useState('');
  const [safra, setSafra] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastrar Cultivo</Text>

      <Text style={styles.label}>Identificação do cultivo:</Text>
      <TextInput style={styles.input} placeholder="(Ex.: Arroz, milho, etc)" value={identificacao} onChangeText={setIdentificacao} />

      <Text style={styles.label}>Endereço:</Text>
      <TextInput style={styles.input} placeholder="(Ex.: Rua, bairro, cidade, estado)" value={endereco} onChangeText={setEndereco} />

      <Text style={styles.label}>Área:</Text>
      <TextInput style={styles.input} placeholder="(Ex.: 20m², 10 hectares)" value={area} onChangeText={setArea} />

      <Text style={styles.label}>Expectativa de produtividade:</Text>
      <TextInput style={styles.input} placeholder="(Ex.: 200 sc/ha)" value={produtividade} onChangeText={setProdutividade} />

      <Text style={styles.label}>Ciclo:</Text>
      <TextInput style={styles.input} placeholder="(Ex.: 132 dias)" value={ciclo} onChangeText={setCiclo} />

      <Text style={styles.label}>Nome do cultivo:</Text>
      <TextInput style={styles.input} placeholder="(Ex.: Arroz Casa)" value={nomeCultivo} onChangeText={setNomeCultivo} />

      <Text style={styles.label}>Safra:</Text>
      <TextInput style={styles.input} placeholder="2024/2025" value={safra} onChangeText={setSafra} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.botaoConfirmar} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoTextoConfirmar}>Concluir cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoTextoCancelar}>Cancelar cadastro</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: '100%',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F0D7',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  botaoConfirmar: {
    backgroundColor: '#cfe3c9',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  botaoTextoConfirmar: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
  botaoCancelar: {
    backgroundColor: '#f5d4cf',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  botaoTextoCancelar: {
    textAlign: 'center',
    color: 'brown',
    fontWeight: 'bold',
  },
});