import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TelaPrincipal from './TelaPrincipal';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      alert('Erro ao encerrar sessão');
    } else {
      // Reseta a navegação e volta para a tela inicial (BoasVindas)
      navigation.reset({
        index: 0,
        routes: [{ name: 'BoasVindas' }],
      });
    }
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Topo com avatar e boas-vindas */}
      <View style={styles.profileSection}>
        <Feather name="user" size={60} color="#222" />
        <Text style={styles.bemVindo}>Bem-Vindo,</Text>
        <Text style={styles.usuario}>Usuário!</Text>
      </View>

      {/* Opções do menu */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => { /* lógica para alterar fonte */ }}
        >
          <MaterialIcons name="text-fields" size={22} color="#222" />
          <Text style={styles.menuText}>Aa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => { /* lógica para conta */ }}
        >
          <Text style={styles.menuText}>Sua Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => { /* lógica para configurações */ }}
        >
          <Text style={styles.menuText}>Configurações</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé com botão de sair */}
      <TouchableOpacity
        style={styles.logoutSection}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Encerrar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#60b246' },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#E6DBB9',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Início" component={TelaPrincipal} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#E6DBB9',
    paddingTop: 40,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  bemVindo: {
    fontSize: 20,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#222',
  },
  usuario: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  menuSection: {
    flex: 1,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#cfc6a3',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#222',
  },
  logoutSection: {
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#cfc6a3',
  },
  logoutText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
});
