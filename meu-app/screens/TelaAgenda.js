import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../config/supabaseClient';

export default function TelaAgenda({ route }) {
  const { cultivo } = route.params;
  const [eventos, setEventos] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [novoEvento, setNovoEvento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Carrega eventos do supabase
  const carregarEventos = async () => {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('cultivo_id', cultivo.id);

    if (error) {
      console.error(error);
      return;
    }

    setEventos(data);
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  // Mapeia eventos para marcar no calendário
  const marcarDatas = eventos.reduce((acc, ev) => {
    acc[ev.data] = {
      marked: true,
      dotColor: 'blue',
    };
    return acc;
  }, {});

  // Salvar evento no Supabase
  const salvarEvento = async () => {
    if (!novoEvento.trim()) {
      alert('Digite o nome do evento!');
      return;
    }

    const { error } = await supabase.from('agenda').insert([
      {
        cultivo_id: cultivo.id,
        data: dataSelecionada,
        evento: novoEvento,
        observacao,
      },
    ]);

    if (error) {
      console.error(error);
      alert('Erro ao salvar evento');
    } else {
      setNovoEvento('');
      setObservacao('');
      setModalVisible(false);
      carregarEventos();
    }
  };

  // Eventos do dia selecionado
  const eventosDoDia = eventos.filter((ev) => ev.data === dataSelecionada);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agenda</Text>
      <View style={styles.linha} />

      <Calendar
        onDayPress={(day) => setDataSelecionada(day.dateString)}
        markedDates={{
          ...marcarDatas,
          ...(dataSelecionada && {
            [dataSelecionada]: {
              selected: true,
              selectedColor: '#81c784',
              marked: marcarDatas[dataSelecionada]?.marked || false,
              dotColor: 'blue',
            },
          }),
        }}
      />

      {dataSelecionada && (
        <View style={styles.eventosContainer}>
          <Text style={styles.subtitulo}>Eventos de {dataSelecionada.split('-').reverse().join('/')}</Text>
          {eventosDoDia.length === 0 ? (
            <Text style={styles.aviso}>Nenhum evento</Text>
          ) : (
            <FlatList
              data={eventosDoDia}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemTexto}>{item.evento}</Text>
                  {item.observacao ? (
                    <Text style={styles.observacao}>{item.observacao}</Text>
                  ) : null}
                </View>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.botao}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textoBotao}>Adicionar evento</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de adicionar evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Adicionar Evento</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: Adicionei adubo"
              value={novoEvento}
              onChangeText={setNovoEvento}
            />

            <TextInput
              style={styles.input}
              placeholder="Observação (opcional)"
              value={observacao}
              onChangeText={setObservacao}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.botao, styles.cancelar]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.salvar]}
                onPress={salvarEvento}
              >
                <Text style={styles.textoBotao}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3eedc', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  linha: { height: 1, backgroundColor: '#000', marginVertical: 10 },
  eventosContainer: { marginTop: 20, flex: 1 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  aviso: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 10 },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemTexto: { fontSize: 16, fontWeight: '500' },
  observacao: { fontSize: 14, fontStyle: 'italic', color: '#555' },
  botao: {
    backgroundColor: '#81c784',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotao: { fontSize: 16, fontWeight: '600', color: '#fff' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#f3eedc',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelar: { backgroundColor: '#e57373', flex: 1, marginRight: 5 },
  salvar: { backgroundColor: '#81c784', flex: 1, marginLeft: 5 },
});
