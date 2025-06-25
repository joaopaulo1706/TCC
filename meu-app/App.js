import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaInicial from './screens/TelaInicial';
import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import CadastroCultivo from './screens/CadastroCultivo';
import DrawerNavigator from './screens/DrawerNavigator'; 

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}