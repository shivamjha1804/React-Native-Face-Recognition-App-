import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppButton, Container} from 'react-native-basic-elements';
import NavigationService from '../../Services/Navigation';

const SignIn = () => {
  return (
    <Container
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3e3e42',
      }}>
      <StatusBar barStyle="light-content" backgroundColor="#3e3e42" />

      <AppButton
        title="Create a new user"
        onPress={() => NavigationService.navigate('NewUser')}
        textStyle={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        style={{
          backgroundColor: '#1E90FF',
          width: '80%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 50,
        }}
      />
      <AppButton
        onPress={() => NavigationService.navigate('FaceRecognation')}
        title="Recognize "
        textStyle={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        style={{
          backgroundColor: '#1E90FF',
          width: '80%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </Container>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
