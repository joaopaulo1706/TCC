import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaInicial from './screens/TelaInicial';
import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import CadastroCultivo from './screens/CadastroCultivo';
import DrawerNavigator from './screens/DrawerNavigator'; 
import TelaSelecao from './screens/TelaSelecao';
import TelaDespesas from './screens/TelaDespesas';
import TelaAdicionarDespesa from './screens/TelaAdicionarDespesa';
import TelaInvestimentos from './screens/TelaInvestimentos';
import TelaAdicionarInvestimento from './screens/TelaAdicionarInvestimento';
import TelaReceitas from './screens/TelaReceitas';
import Vendas from './screens/Vendas';
import AdicionarVenda from './screens/AdicionarVenda';
import TelaAgenda from './screens/TelaAgenda';
import TelaConta from './screens/TelaConta';
import AlterarNome from './screens/AlterarNome';
import AlterarFoto from './screens/Alterarfoto';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BoasVindas" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BoasVindas" component={TelaInicial} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TelaPrincipal" component={DrawerNavigator} /> 
        <Stack.Screen name="CadastroCultivo" component={CadastroCultivo} />
        <Stack.Screen name="TelaSelecao" component={TelaSelecao} />
        <Stack.Screen name="TelaDespesas" component={TelaDespesas} />
        <Stack.Screen name="TelaAdicionarDespesa" component={TelaAdicionarDespesa} />
        <Stack.Screen name="TelaInvestimentos" component={TelaInvestimentos} />
        <Stack.Screen name="TelaAdicionarInvestimento" component={TelaAdicionarInvestimento} />
        <Stack.Screen name="TelaReceitas" component={TelaReceitas} />
        <Stack.Screen name="Vendas" component={Vendas} />
        <Stack.Screen name="AdicionarVenda" component={AdicionarVenda} />
        <Stack.Screen name="TelaAgenda" component={TelaAgenda} />
        <Stack.Screen name="TelaConta" component={TelaConta} />
        <Stack.Screen name="AlterarNome" component={AlterarNome} />
        <Stack.Screen name="AlterarFoto" component={AlterarFoto} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}