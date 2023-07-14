import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Nav from './src/Nav';

export default function App() {
  return (
    <NavigationContainer>
      <Nav />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
