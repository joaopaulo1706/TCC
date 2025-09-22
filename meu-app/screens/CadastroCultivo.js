import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { supabase } from '../config/supabaseClient';

export default function CadastroCultivo({ route, navigation }) {
  const { cultivo } = route.params || {}; // 🔹 se vier cultivo = edição

  const [identificacao, setIdentificacao] = useState(cultivo ? cultivo.identificacao : '');
  const [endereco, setEndereco] = useState(cultivo ? cultivo.endereco : '');
  const [area, setArea] = useState(cultivo ? cultivo.area : '');
  const [expectativaProdutividade, setExpectativaProdutividade] = useState(
    cultivo ? cultivo.expectativa_produtividade : ''
  );
  const [ciclo, setCiclo] = useState(cultivo ? cultivo.ciclo : '');
  const [nome, setNome] = useState(cultivo ? cultivo.nome : '');
  const [safra, setSafra] = useState(cultivo ? cultivo.safra : '');

  // 🔹 Define safra padrão só se for cadastro
  useEffect(() => {
    if (!cultivo) {
      const anoAtual = new Date().getFullYear();
      const safraPadrao = `${anoAtual}/${anoAtual + 1}`;
      setSafra(safraPadrao);
    }
  }, []);

  const handleSalvar = async () => {
    if (!identificacao.trim() || !nome.trim()) {
      Alert.alert(
        'Atenção',
        'Preencha pelo menos o nome e a identificação do cultivo.'
      );
      return;
    }

    try {
      if (cultivo && cultivo.id) {
        // 🔹 Atualizar cultivo existente
        const { error } = await supabase
          .from('cultivo')
          .update({
            identificacao,
            endereco,
            area,
            expectativa_produtividade: expectativaProdutividade,
            ciclo,
            nome,
            safra,
          })
          .eq('id', cultivo.id);

        if (error) {
          console.error(error);
          Alert.alert('Erro', 'Não foi possível atualizar o cultivo.');
          return;
        }

        Alert.alert('Sucesso', 'Cultivo atualizado com sucesso!');
        navigation.goBack();
      } else {
        // 🔹 Cadastrar novo cultivo
        const { data: { user } } = await supabase.auth.getUser();

        const { data: produtor, error: produtorError } = await supabase
          .from('productor')
          .select('uuid_id')
          .eq('user_id', user.id)
          .single();

        if (produtorError || !produtor) {
          Alert.alert('Erro', 'Não foi possível encontrar o produtor.');
          return;
        }

        const { error: insertError } = await supabase.from('cultivo').insert([
          {
            produtor_id: produtor.uuid_id,
            identificacao,
            endereco,
            area,
            expectativa_produtividade: expectativaProdutividade,
            ciclo,
            nome,
            safra,
          },
        ]);

        if (insertError) {
          console.error(insertError);
          Alert.alert('Erro', 'Não foi possível cadastrar o cultivo.');
          return;
        }

        Alert.alert('Sucesso', 'Cultivo cadastrado com sucesso!');
        navigation.goBack();
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Algo deu errado.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {cultivo ? 'Editar Cultivo' : 'Cadastrar Cultivo'}
      </Text>

      <Text style={styles.label}>Identificação do cultivo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Arroz, milho, etc"
        value={identificacao}
        onChangeText={setIdentificacao}
      />

      <Text style={styles.label}>Nome do cultivo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Arroz Casa"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Endereço:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Rua, bairro, cidade, estado"
        value={endereco}
        onChangeText={setEndereco}
      />

      <Text style={styles.label}>Área:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 20m², 10 hectares"
        value={area}
        onChangeText={setArea}
      />

      <Text style={styles.label}>Expectativa de produtividade:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 200 sc/ha"
        value={expectativaProdutividade}
        onChangeText={setExpectativaProdutividade}
      />

      <Text style={styles.label}>Ciclo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 132 dias"
        value={ciclo}
        onChangeText={setCiclo}
      />

      <Text style={styles.label}>Safra:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 2024/2025"
        value={safra}
        onChangeText={setSafra}
      />

      <TouchableOpacity style={[styles.button, styles.success]} onPress={handleSalvar}>
        <Text style={styles.buttonTextGreen}>
          {cultivo ? 'Salvar Alterações' : 'Concluir cadastro'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.danger]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonTextRed}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0e8d5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    marginBottom: 15,
    paddingVertical: 5,
  },
  button: {
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#d4edda',
  },
  danger: {
    backgroundColor: '#f8d7da',
  },
  buttonTextGreen: {
    color: 'green',
    fontWeight: 'bold',
  },
  buttonTextRed: {
    color: 'darkred',
    fontWeight: 'bold',
  },
});
